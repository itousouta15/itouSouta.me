import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// 讓外部服務（itouBot 發完碎碎念後）觸發 /thoughts 頁面即時更新
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  revalidatePath("/thoughts");
  return NextResponse.json({ revalidated: true });
}
