import { NextRequest, NextResponse } from "next/server";
import {
  getVisitorImpressions,
  leaveVisitorImpression,
  rateLimit,
} from "../../lib/kv";
import {
  IMPRESSION_MAX_LENGTH,
  IMPRESSION_COOLDOWN_SECONDS,
  normalizeImpression,
} from "../../lib/impressions";

// 留印後立即讀得到新計數，GET 不進 Next.js 的靜態路由快取。
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(
      { impressions: await getVisitorImpressions() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { error: "暫時無法讀取印記，請稍後再試" },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  const body: unknown = await req.json().catch(() => null);
  const tag = normalizeImpression(
    body && typeof body === "object" && "tag" in body ? body.tag : null
  );
  if (!tag) {
    return NextResponse.json(
      { error: `印象需 1～${IMPRESSION_MAX_LENGTH} 字` },
      { status: 400 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  try {
    if (!(await rateLimit(ip, "impressions", 5, 60))) {
      return NextResponse.json(
        { error: "留印太快了，請過一分鐘再試", retryAfter: 60 },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
    const result = await leaveVisitorImpression(tag, ip);
    if (result.kind !== "created") {
      return NextResponse.json(
        {
          error:
            result.kind === "duplicate"
              ? "這個印象你已經留過了，24 小時內不會重複計數"
              : `請等待 ${result.retryAfter} 秒再留印`,
          retryAfter: result.retryAfter,
        },
        {
          status: result.kind === "duplicate" ? 409 : 429,
          headers: { "Retry-After": String(result.retryAfter) },
        }
      );
    }
    return NextResponse.json({
      tag,
      count: result.count,
      cooldownSeconds: IMPRESSION_COOLDOWN_SECONDS,
    });
  } catch {
    return NextResponse.json(
      { error: "留印失敗，請稍後再試" },
      { status: 503 }
    );
  }
}
