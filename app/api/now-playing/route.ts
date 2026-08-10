import { NextResponse } from "next/server";
import { DISCORD_USER_ID } from "../../siteConfig";
import { getCurrentlyPlayingDebug } from "../../lib/spotify";

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

interface LanyardResult {
  track: {
    song: string;
    artist: string;
    album: string;
    album_art_url: string;
    href: string | null;
    is_playing: boolean;
    progress_ms: number;
    duration_ms: number;
  } | null;
  reason?: string;
}

async function fromLanyard(): Promise<LanyardResult> {
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
      { cache: "no-store" }
    );
    if (!res.ok) return { track: null, reason: `lanyard-http-${res.status}` };
    const json = await res.json();
    const data = json?.data;
    if (!data?.listening_to_spotify || !data.spotify) {
      return { track: null, reason: "lanyard-not-listening" };
    }
    const s: LanyardSpotify = data.spotify;
    const durationMs = s.timestamps ? s.timestamps.end - s.timestamps.start : 0;
    const progressMs = s.timestamps ? Date.now() - s.timestamps.start : 0;
    return {
      track: {
        song: s.song,
        artist: s.artist,
        album: s.album,
        album_art_url: s.album_art_url,
        href: s.track_id
          ? `https://open.spotify.com/track/${s.track_id}`
          : null,
        is_playing: true,
        progress_ms: Math.max(0, progressMs),
        duration_ms: durationMs,
      },
    };
  } catch {
    return { track: null, reason: "lanyard-exception" };
  }
}

export async function GET(request: Request) {
  const debug = new URL(request.url).searchParams.get("debug") === "1";

  const spotify = await getCurrentlyPlayingDebug();
  if (spotify.track) {
    return NextResponse.json({
      song: spotify.track.song,
      artist: spotify.track.artist,
      album: spotify.track.album,
      album_art_url: spotify.track.albumArt,
      href: spotify.track.href || null,
      is_playing: spotify.track.isPlaying,
      progress_ms: spotify.track.progressMs,
      duration_ms: spotify.track.durationMs,
    });
  }

  const lanyard = await fromLanyard();
  if (debug && !lanyard.track) {
    return NextResponse.json({
      debug: {
        spotifyReason: spotify.reason,
        lanyardReason: lanyard.reason,
        hasSpotifyClientId: !!process.env.SPOTIFY_CLIENT_ID,
        hasSpotifyClientSecret: !!process.env.SPOTIFY_CLIENT_SECRET,
        hasSpotifyRefreshToken: !!process.env.SPOTIFY_REFRESH_TOKEN,
      },
    });
  }
  return NextResponse.json(lanyard.track);
}
