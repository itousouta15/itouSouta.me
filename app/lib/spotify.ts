// Spotify 常聽歌曲榜，餵給 about 頁的音樂卡片、/likes 首頁的音樂預覽列、/likes/music 完整清單。
// 用 /me/top/tracks（OAuth 授權的個人 top tracks）而非 client credentials：Spotify 的
// 使用者個人資料（top tracks、liked songs…）一定要綁使用者授權才拿得到。
// 需要三個環境變數（缺任一個就回傳 null，呼叫端各自 fallback）：
//   SPOTIFY_CLIENT_ID — https://developer.spotify.com/dashboard 建立 App 取得
//   SPOTIFY_CLIENT_SECRET — 同上，Dashboard 內顯示
//   SPOTIFY_REFRESH_TOKEN — 跑 `node scripts/spotify-refresh-token.mjs` 一次性取得；
//     授權導向 http://localhost:8888/callback，由該 script 自己起的本機伺服器接住
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API_URL = "https://api.spotify.com/v1";

export interface TopTrack {
  title: string;
  artist: string;
  cover: string;
  href: string;
}

export interface CurrentlyPlaying {
  song: string;
  artist: string;
  album: string;
  albumArt: string;
  href: string;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
}

async function getAccessToken(): Promise<string | null> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  try {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${clientId}:${clientSecret}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.access_token as string) || null;
  } catch {
    return null;
  }
}

export async function getTopTracks(options?: {
  limit?: number;
  timeRange?: "short_term" | "medium_term" | "long_term";
}): Promise<TopTrack[] | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const params = new URLSearchParams({
      limit: String(options?.limit ?? 4),
      time_range: options?.timeRange ?? "medium_term",
    });
    const res = await fetch(`${API_URL}/me/top/tracks?${params}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();

    const tracks: TopTrack[] = (json.items ?? [])
      .map((t: any) => ({
        title: t.name ?? "",
        artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
        // album.images 依序由大到小，第一張是最大（通常 640px）
        cover: t.album?.images?.[0]?.url ?? "",
        href: t.external_urls?.spotify ?? "",
      }))
      .filter((t: TopTrack) => t.title && t.cover);
    return tracks.length ? tracks : null;
  } catch {
    return null;
  }
}

// 目前正在播放的曲目（`/me/player/currently-playing`）。這是直接問 Spotify 帳號
// 本身在播什麼，不像 Lanyard 那樣得靠 Discord 用戶端轉發——手機沒開 Discord app
// 時 Lanyard 抓不到 Spotify 活動的老問題，因此不會發生在這裡。
// 需要 refresh token 授權時多帶 user-read-currently-playing scope（見
// scripts/spotify-refresh-token.mjs），舊 token 沒有這個 scope 得重新授權一次。
export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;

  try {
    const res = await fetch(
      `${API_URL}/me/player/currently-playing?additional_types=track`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    // 204 = 帳號目前沒在播放任何東西
    if (res.status === 204 || !res.ok) return null;
    const json = await res.json();
    if (!json?.item || json.currently_playing_type !== "track") return null;

    return {
      song: json.item.name ?? "",
      artist: (json.item.artists ?? []).map((a: any) => a.name).join(", "),
      album: json.item.album?.name ?? "",
      albumArt: json.item.album?.images?.[0]?.url ?? "",
      href: json.item.external_urls?.spotify ?? "",
      isPlaying: !!json.is_playing,
      progressMs: json.progress_ms ?? 0,
      durationMs: json.item.duration_ms ?? 0,
    };
  } catch {
    return null;
  }
}
