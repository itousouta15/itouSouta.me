import { NextRequest, NextResponse } from "next/server";
import {
  addGuestbookEntry,
  getGuestbookEntries,
  rateLimit,
} from "../../lib/kv";

/* 留言板：讀取與送出都走這裡（KV 自建，取代原本連部落格 waline 伺服器的方案——
   那台伺服器鎖了部落格網域，只給讀不給寫）。 */

export const revalidate = 60;

export async function GET() {
  try {
    return NextResponse.json({ entries: await getGuestbookEntries() });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}

const NICK_MAX = 20;
const TEXT_MAX = 500;

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
      website?: string;
    } | null;
    if (!body) return NextResponse.json({ error: "bad body" }, { status: 400 });

    // honeypot：真人看不到這個欄位，有值就是機器人——假裝成功但不存
    if (typeof body.website === "string" && body.website !== "") {
      return NextResponse.json({ ok: true });
    }

    const nick = (body.nick ?? "").trim();
    const text = (body.text ?? "").trim();
    if (nick.length < 2 || nick.length > NICK_MAX) {
      return NextResponse.json(
        { error: `暱稱需 2~${NICK_MAX} 字` },
        { status: 400 }
      );
    }
    if (text.length < 1 || text.length > TEXT_MAX) {
      return NextResponse.json(
        { error: `留言需 1~${TEXT_MAX} 字` },
        { status: 400 }
      );
    }

    await addGuestbookEntry({
      id: crypto.randomUUID(),
      nick,
      text,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
