import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Optional authenticated hook for refreshing writing content.
export async function POST(req: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return new NextResponse("Not found", { status: 404 });
  if (!secret || req.headers.get("x-revalidate-secret") !== secret) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  revalidatePath("/writing");
  return NextResponse.json({ revalidated: true });
}
