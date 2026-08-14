import { NextRequest, NextResponse } from "next/server";
import {
  addGuestbookEntry,
  addGuestbookReply,
  findGuestbookEntryRaw,
  getGuestbookEntries,
  getGuestbookReplies,
  getRepliesForComment,
  rateLimit,
  type GuestbookReply,
} from "../../lib/kv";
import { normalizePath } from "../../lib/path";
import { gravatarUrl, isValidEmail } from "../../lib/gravatar";
import { verifyGithubIdentity } from "../../lib/githubAuth";
import { sendReplyNotification } from "../../lib/notify";

/* 留言板：讀取與送出都走這裡（KV 自建，取代原本連部落格 waline 伺服器的方案——
   那台伺服器鎖了部落格網域，只給讀不給寫）。每頁各自獨立，用 path 分開存。
   回覆走同一支 API：POST 帶 commentId（頂層留言 id）與 parentId（實際被回覆的
   留言或回覆 id），存進該頁的回覆 hash；被回覆者有留 email 就寄通知。 */

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const path = normalizePath(req.nextUrl.searchParams.get("path"));
  if (!path) return NextResponse.json({ error: "bad path" }, { status: 400 });
  try {
    const [entries, replies] = await Promise.all([
      getGuestbookEntries(path),
      getGuestbookReplies(path),
    ]);
    return NextResponse.json({
      entries: entries.map((en) => ({ ...en, replies: replies[en.id] ?? [] })),
    });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}

const NICK_MAX = 20;
const TEXT_MAX = 500;

/** 網址欄位是使用者自由填的展示連結，不是能不填就跳過驗證的東西——只收 http(s)，
 *  格式不對就當作沒填，不因為這種小事擋掉整則留言。 */
function normalizeWebsite(input: string | undefined): string | null {
  const trimmed = (input ?? "").trim();
  if (!trimmed) return null;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString().slice(0, 300);
  } catch {
    return null;
  }
}

interface Identity {
  nick: string;
  avatar: string | null;
  link: string | null;
  source: "manual" | "github";
  email: string | null;
}

function resolveIdentity(body: {
  nick?: string;
  email?: string;
  website?: string;
  githubToken?: string;
}): Identity | { error: string } {
  if (body.githubToken) {
    const gh = verifyGithubIdentity(body.githubToken);
    if (!gh) {
      return { error: "GitHub 登入已過期，請重新登入" };
    }
    return {
      nick: gh.login,
      avatar: gh.avatarUrl,
      link: gh.profileUrl,
      source: "github",
      email: gh.email && isValidEmail(gh.email) ? gh.email.toLowerCase() : null,
    };
  }

  const nick = (body.nick ?? "").trim();
  if (nick.length < 2 || nick.length > NICK_MAX) {
    return { error: `暱稱需 2~${NICK_MAX} 字` };
  }
  const email = (body.email ?? "").trim();
  const normalizedEmail = isValidEmail(email) ? email.toLowerCase() : null;
  return {
    nick,
    avatar: normalizedEmail ? gravatarUrl(normalizedEmail) : null,
    link: normalizeWebsite(body.website),
    source: "manual",
    email: normalizedEmail,
  };
}

/** 回覆通知要寄給誰：被回覆者（留言或回覆的作者）；回覆的是「回覆」時，頂層
 *  留言的作者也想知道有人繼續接話。去重、過濾不合法格式。
 *  （回覆自己也會寄——使用者常這樣補內容，有封信比較踏實。） */
function collectRecipients(
  root: { email?: string | null },
  parent: { email?: string | null } | null
): string[] {
  const list: string[] = [];
  for (const email of [parent?.email, root.email]) {
    if (email && isValidEmail(email)) {
      const key = email.toLowerCase();
      if (!list.includes(key)) list.push(key);
    }
  }
  return list;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    if (!(await rateLimit(ip, "guestbook", 5, 3600))) {
      return NextResponse.json(
        { error: "太快了，休息一下再來" },
        { status: 429 }
      );
    }

    const body = (await req.json().catch(() => null)) as {
      nick?: string;
      text?: string;
      email?: string;
      website?: string;
      hp?: string;
      path?: string;
      githubToken?: string;
      commentId?: string;
      parentId?: string;
    } | null;
    if (!body) return NextResponse.json({ error: "bad body" }, { status: 400 });

    const path = normalizePath(body.path ?? null);
    if (!path) return NextResponse.json({ error: "bad path" }, { status: 400 });

    // honeypot：真人看不到這個欄位，有值就是機器人——假裝成功但不存
    if (typeof body.hp === "string" && body.hp !== "") {
      return NextResponse.json({ ok: true });
    }

    const text = (body.text ?? "").trim();
    if (text.length < 1 || text.length > TEXT_MAX) {
      return NextResponse.json(
        { error: `內容需 1~${TEXT_MAX} 字` },
        { status: 400 }
      );
    }

    const identity = resolveIdentity(body);
    if ("error" in identity) {
      return NextResponse.json({ error: identity.error }, { status: 400 });
    }
    const { nick, avatar, link, source, email } = identity;

    const isReply = typeof body.commentId === "string" && body.commentId !== "";

    if (isReply) {
      const root = await findGuestbookEntryRaw(path, body.commentId!);
      if (!root) {
        return NextResponse.json(
          { error: "找不到要回覆的留言" },
          { status: 400 }
        );
      }

      const parentId = typeof body.parentId === "string" ? body.parentId : null;
      const siblings = await getRepliesForComment(path, root.id);
      const parent =
        parentId === root.id
          ? root
          : (siblings.find((r) => r.id === parentId) ?? null);
      if (!parent) {
        return NextResponse.json(
          { error: "找不到要回覆的留言" },
          { status: 400 }
        );
      }

      const reply: GuestbookReply = {
        id: crypto.randomUUID(),
        nick,
        text,
        timestamp: new Date().toISOString(),
        parentId: parent.id,
        replyToNick: parent.nick,
        avatar,
        link,
        source,
        email,
      };
      await addGuestbookReply(path, root.id, reply);

      const recipients = collectRecipients(root, parent);
      if (recipients.length === 0) {
        console.warn("[guestbook] reply notification skipped: 對方沒留 email");
      }
      await sendReplyNotification({
        to: recipients,
        replyNick: nick,
        replyText: text,
        parentText: parent.text.slice(0, 200),
        pagePath: path,
        anchorId: reply.id,
      });
      return NextResponse.json({ ok: true });
    }

    await addGuestbookEntry(
      {
        id: crypto.randomUUID(),
        nick,
        text,
        timestamp: new Date().toISOString(),
        avatar,
        link,
        source,
        email,
      },
      path
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
