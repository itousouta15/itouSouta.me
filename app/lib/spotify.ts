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
  id: string;
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

// 帶 reason 是為了讓 /api/now-playing?debug=1 能回報卡在哪一步（缺憑證／換
// token 失敗／API 錯誤…），不然失敗一律回 null，遠端排查時完全看不出原因。
interface AccessTokenResult {
  token: string | null;
  reason?: string;
}

// Token 只在伺服器實例內共用；同時到來的請求也共用同一次 refresh。
// 過期前一分鐘就重新取得，避免 Spotify API 收到快過期的 token。
let cachedToken: { value: string; expiresAt: number } | null = null;
let pendingToken: Promise<AccessTokenResult> | null = null;

async function getAccessToken(): Promise<AccessTokenResult> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    return { token: null, reason: "missing-credentials" };
  }

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return { token: cachedToken.value };
  }
  if (pendingToken) return pendingToken;

  pendingToken = (async (): Promise<AccessTokenResult> => {
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
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        return { token: null, reason: `token-refresh-http-${res.status}` };
      }
      const json = await res.json();
      const token = (json.access_token as string) || null;
      const expiresIn = Number(json.expires_in);
      if (token && Number.isFinite(expiresIn) && expiresIn > 60) {
        cachedToken = {
          value: token,
          expiresAt: Date.now() + (expiresIn - 60) * 1000,
        };
      }
      return token ? { token } : { token: null, reason: "token-refresh-empty" };
    } catch {
      return { token: null, reason: "token-refresh-exception" };
    }
  })().finally(() => {
    pendingToken = null;
  });
  return pendingToken;
}

function invalidateToken(token: string) {
  if (cachedToken?.value === token) cachedToken = null;
}

export async function getTopTracks(options?: {
  limit?: number;
  timeRange?: "short_term" | "medium_term" | "long_term";
}): Promise<TopTrack[] | null> {
  const { token: accessToken } = await getAccessToken();
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
    if (res.status === 401) invalidateToken(accessToken);
    if (!res.ok) return null;
    const json = await res.json();

    const tracks: TopTrack[] = (json.items ?? [])
      .map((t: any) => ({
        id: t.id ?? "",
        title: t.name ?? "",
        artist: (t.artists ?? []).map((a: any) => a.name).join(", "),
        // album.images 依序由大到小，第一張是最大（通常 640px）
        cover: t.album?.images?.[0]?.url ?? "",
        href: t.external_urls?.spotify ?? "",
      }))
      .filter((t: TopTrack) => t.id && t.title && t.cover);
    return tracks.length ? tracks : null;
  } catch {
    return null;
  }
}

export interface RecentPlay {
  trackId: string;
  playedAt: string;
}

export interface RecentPlaysResult {
  plays: RecentPlay[] | null;
  reason?: string;
}

// Spotify 沒有個人累計次數；只使用官方回傳的 played_at 紀錄來累加。
// 需 user-read-recently-played，舊 token 的授權不會因修改程式自動增加。
export async function getRecentlyPlayedTracks(): Promise<RecentPlaysResult> {
  const { token, reason } = await getAccessToken();
  if (!token) return { plays: null, reason };
  try {
    const response = await fetch(
      `${API_URL}/me/player/recently-played?limit=50`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      }
    );
    if (response.status === 401) invalidateToken(token);
    if (!response.ok)
      return { plays: null, reason: `history-http-${response.status}` };
    const data = await response.json();
    if (!Array.isArray(data.items))
      return { plays: null, reason: "invalid-history" };
    const plays: RecentPlay[] = [];
    for (const item of data.items) {
      if (
        item?.track?.is_local ||
        (item?.track?.type && item.track.type !== "track") ||
        typeof item?.track?.id !== "string" ||
        !/^[a-zA-Z0-9]{22}$/.test(item.track.id) ||
        typeof item.played_at !== "string"
      )
        continue;
      const timestamp = Date.parse(item.played_at);
      if (!Number.isFinite(timestamp)) continue;
      plays.push({
        trackId: item.track.id,
        playedAt: new Date(timestamp).toISOString(),
      });
    }
    return { plays };
  } catch {
    return { plays: null, reason: "history-fetch-exception" };
  }
}

export interface CurrentlyPlayingResult {
  track: CurrentlyPlaying | null;
  // 失敗原因（missing-credentials／token-refresh-*／not-playing／api-http-*／
  // no-track-item／fetch-exception），只給 /api/now-playing?debug=1 用。
  reason?: string;
}

// 目前正在播放的曲目（`/me/player/currently-playing`）。這是直接問 Spotify 帳號
// 本身在播什麼，不像 Lanyard 那樣得靠 Discord 用戶端轉發——手機沒開 Discord app
// 時 Lanyard 抓不到 Spotify 活動的老問題，因此不會發生在這裡。
// 需要 refresh token 授權時多帶 user-read-currently-playing scope（見
// scripts/spotify-refresh-token.mjs），舊 token 沒有這個 scope 得重新授權一次。
export async function getCurrentlyPlayingDebug(): Promise<CurrentlyPlayingResult> {
  const { token: accessToken, reason } = await getAccessToken();
  if (!accessToken) return { track: null, reason };

  try {
    const res = await fetch(
      `${API_URL}/me/player/currently-playing?additional_types=track`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    // 204 = 帳號目前沒在播放任何東西
    if (res.status === 204) return { track: null, reason: "not-playing" };
    if (res.status === 401) invalidateToken(accessToken);
    if (!res.ok) return { track: null, reason: `api-http-${res.status}` };
    const json = await res.json();
    if (!json?.item || json.currently_playing_type !== "track") {
      return { track: null, reason: "no-track-item" };
    }

    return {
      track: {
        song: json.item.name ?? "",
        artist: (json.item.artists ?? []).map((a: any) => a.name).join(", "),
        album: json.item.album?.name ?? "",
        albumArt: json.item.album?.images?.[0]?.url ?? "",
        href: json.item.external_urls?.spotify ?? "",
        isPlaying: !!json.is_playing,
        progressMs: json.progress_ms ?? 0,
        durationMs: json.item.duration_ms ?? 0,
      },
    };
  } catch {
    return { track: null, reason: "fetch-exception" };
  }
}

export async function getCurrentlyPlaying(): Promise<CurrentlyPlaying | null> {
  return (await getCurrentlyPlayingDebug()).track;
}
