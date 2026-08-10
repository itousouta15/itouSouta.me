import { NextRequest, NextResponse } from "next/server";
import {
  addGuestbookEntry,
  getGuestbookEntries,
  rateLimit,
} from "../../lib/kv";
import { normalizePath } from "../../lib/path";
import { gravatarUrl } from "../../lib/gravatar";
import { verifyGithubIdentity } from "../../lib/githubAuth";

/* 留言板：讀取與送出都走這裡（KV 自建，取代原本連部落格 waline 伺服器的方案——
   那台伺服器鎖了部落格網域，只給讀不給寫）。每頁各自獨立，用 path 分開存。 */

export const revalidate = 60;

export async function GET(req: NextRequest) {
  const path = normalizePath(req.nextUrl.searchParams.get("path"));
  if (!path) return NextResponse.json({ error: "bad path" }, { status: 400 });
  try {
    return NextResponse.json({ entries: await getGuestbookEntries(path) });
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
        { error: `留言需 1~${TEXT_MAX} 字` },
        { status: 400 }
      );
    }

    let nick: string;
    let avatar: string | null;
    let link: string | null;
    let source: "manual" | "github";

    if (body.githubToken) {
      const gh = verifyGithubIdentity(body.githubToken);
      if (!gh) {
        return NextResponse.json(
          { error: "GitHub 登入已過期，請重新登入" },
          { status: 400 }
        );
      }
      nick = gh.login;
      avatar = gh.avatarUrl;
      link = gh.profileUrl;
      source = "github";
    } else {
      nick = (body.nick ?? "").trim();
      if (nick.length < 2 || nick.length > NICK_MAX) {
        return NextResponse.json(
          { error: `暱稱需 2~${NICK_MAX} 字` },
          { status: 400 }
        );
      }
      avatar = body.email ? gravatarUrl(body.email) : null;
      link = normalizeWebsite(body.website);
      source = "manual";
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
      },
      path
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
