import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { syncSpotifyPlayHistory } from "../../../lib/spotifyHistory";

export const dynamic = "force-dynamic";

// 排程只同步伺服器自己的 Spotify 帳號，不接受訪客上傳播放紀錄。
export async function GET(request: Request) {
  const secret = process.env.SPOTIFY_SYNC_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  const result = await syncSpotifyPlayHistory();
  if (result.status === "synced") {
    revalidatePath("/likes");
    revalidatePath("/likes/music");
  }
  const ok = result.status === "synced" || result.status === "throttled";
  return NextResponse.json(result, { status: ok ? 200 : 503 });
}
