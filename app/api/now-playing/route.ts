import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "../../siteConfig";
import { getCurrentlyPlaying } from "../../lib/spotify";

// 現在正在聽的 Spotify 曲目。優先直接打 Spotify Web API（不經 Discord），因為
// Lanyard 的 Spotify 活動是靠 Discord 用戶端轉發的，手機上沒開 Discord app 就抓
// 不到；直接問 Spotify 帳號本身就不受這個限制。沒設定 SPOTIFY_* 環境變數，或帳號
// 目前真的沒在播放時，退回 Lanyard（經 Discord 轉發）當備援。沒有在聽時回 null。

export const dynamic = "force-dynamic";

interface LanyardSpotify {
  song: string;
  artist: string;
  album: string;
  album_art_url: string;
  track_id?: string;
  timestamps?: { start: number; end: number };
}

async function fromLanyard() {
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const json = await res.json();
    const data = json?.data;
    if (!data?.listening_to_spotify || !data.spotify) return null;
    const s: LanyardSpotify = data.spotify;
    const durationMs = s.timestamps ? s.timestamps.end - s.timestamps.start : 0;
    const progressMs = s.timestamps ? Date.now() - s.timestamps.start : 0;
    return {
      song: s.song,
      artist: s.artist,
      album: s.album,
      album_art_url: s.album_art_url,
      href: s.track_id ? `https://open.spotify.com/track/${s.track_id}` : null,
      is_playing: true,
      progress_ms: Math.max(0, progressMs),
      duration_ms: durationMs,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const spotify = await getCurrentlyPlaying();
  if (spotify) {
    return NextResponse.json({
      song: spotify.song,
      artist: spotify.artist,
      album: spotify.album,
      album_art_url: spotify.albumArt,
      href: spotify.href || null,
      is_playing: spotify.isPlaying,
      progress_ms: spotify.progressMs,
      duration_ms: spotify.durationMs,
    });
  }
  return NextResponse.json(await fromLanyard());
}
