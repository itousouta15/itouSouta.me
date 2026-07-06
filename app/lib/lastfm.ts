// Last.fm 常聽專輯榜，餵給 about 頁的音樂卡片、/likes 首頁的音樂預覽列、/likes/music 完整清單。
// 用專輯榜而非歌曲榜或歌手榜：Last.fm 的歌手／歌曲 API 現在一律回傳同一張預設佔位圖，
// 只有專輯榜的 image 欄位是真封面。
// 需要兩個環境變數（缺任一個就回傳 null，呼叫端各自 fallback）：
//   LASTFM_API_KEY — https://www.last.fm/api/account/create 申請（免費、即時核發）
//   LASTFM_USER — 你的 Last.fm 使用者名稱
const API_URL = "https://ws.audioscrobbler.com/2.0/";

export interface TopAlbum {
  title: string;
  artist: string;
  cover: string;
  href: string;
}

export async function getTopAlbums(options?: { limit?: number; period?: string }): Promise<TopAlbum[] | null> {
  const apiKey = process.env.LASTFM_API_KEY;
  const user = process.env.LASTFM_USER;
  if (!apiKey || !user) return null;

  try {
    const params = new URLSearchParams({
      method: "user.gettopalbums",
      user,
      api_key: apiKey,
      format: "json",
      period: options?.period ?? "1month",
      limit: String(options?.limit ?? 4),
    });
    const res = await fetch(`${API_URL}?${params}`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const json = await res.json();

    const albums: TopAlbum[] = (json.topalbums?.album ?? [])
      .map((a: any) => ({
        title: a.name ?? "",
        artist: a.artist?.name ?? "",
        // image 尺寸依序 small/medium/large/extralarge，extralarge 是 300px
        cover: (a.image ?? []).find((i: any) => i.size === "extralarge")?.["#text"] ?? "",
        href: a.url ?? "",
      }))
      .filter((a: TopAlbum) => a.title && a.cover);
    return albums.length ? albums : null;
  } catch {
    return null;
  }
}
