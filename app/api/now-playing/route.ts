import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "../../siteConfig";

// 現在正在聽的 Spotify 曲目（經 Lanyard）。沒有在聽或抓不到 → null。
// 給 /api 文件頁、專案 README 或任何外部服務用。

export const revalidate = 60;

interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  timestamps?: { start: number; end: number };
}

export async function GET() {
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return NextResponse.json(null);
    const json = await res.json();
    const data = json?.data;
    if (!data?.listening_to_spotify || !data.spotify) {
      return NextResponse.json(null);
    }
    const s: LanyardSpotify = data.spotify;
    let progress: number | null = null;
    if (s.timestamps?.start && s.timestamps?.end) {
      const now = Date.now();
      progress = Math.min(
        1,
        Math.max(
          0,
          (now - s.timestamps.start) / (s.timestamps.end - s.timestamps.start)
        )
      );
    }
    return NextResponse.json({
      song: s.song,
      artist: s.artist,
      album: s.album,
      album_art_url: s.album_art_url,
      progress,
    });
  } catch {
    return NextResponse.json(null);
  }
}
