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
