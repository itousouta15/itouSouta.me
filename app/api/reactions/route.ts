import { NextRequest, NextResponse } from "next/server";
import { getReactionCounts, incrReaction, rateLimit } from "../../lib/kv";

/* 雜談按讚：GET 聚合計數（/writing 頁 server 端自己讀 KV 也行，這個是給外部/
   client 用的）、POST 按讚。KV 沒有環境（本機 dev）時 503。 */

export const revalidate = 60;

export async function GET(req: NextRequest) {
  try {
    const ids = (req.nextUrl.searchParams.get("ids") ?? "")
      .split(",")
      .filter(Boolean);
    const counts = await getReactionCounts();
    const out: Record<string, number> = {};
    for (const id of ids) out[id] = counts[id] ?? 0;
    return NextResponse.json(out);
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    if (!(await rateLimit(ip, "react", 30, 3600))) {
      return NextResponse.json({ error: "太快了" }, { status: 429 });
    }
    const body = (await req.json().catch(() => null)) as { id?: string } | null;
    const id = body?.id;
    if (typeof id !== "string" || !id) {
      return NextResponse.json({ error: "bad id" }, { status: 400 });
    }
    const count = await incrReaction(id);
    return NextResponse.json({ id, count });
  } catch {
    return NextResponse.json({ error: "kv unavailable" }, { status: 503 });
  }
}
