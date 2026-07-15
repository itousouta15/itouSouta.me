import { NextResponse } from "next/server";
import { incrementVisitorCount } from "../../lib/visitors";

export async function GET() {
  const count = await incrementVisitorCount();
  return NextResponse.json({ count });
}
