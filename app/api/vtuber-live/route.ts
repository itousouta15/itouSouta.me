import { NextResponse } from "next/server";
import { LIKE_CATEGORIES } from "../../data";

// 不用 YouTube Data API（沒有 quota/金鑰），改成跟一般 Discord bot 一樣的土法煉鋼：
// 打頻道的 /live，YouTube 直播中會 302 到 watch?v=...，不然就留在頻道頁本身。
export const revalidate = 60;

interface LiveInfo {
  live: boolean;
  url?: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

// YouTube 對 /live 這條路徑不是發 302，而是直接把該頁 render 成當前直播（或最近一支影片）的
// watch 頁內容，網址列還是停在 /live。所以不能看 res.url，得整頁抓下來看內嵌的 ytInitialPlayerResponse。
// 且 "isLive":true 這個字串在整頁到處都會出現（推薦影片、其他人的直播卡片等等），
// 只在 videoDetails 開頭那小段（videoId → title → lengthSeconds → isLive）找才準，
// 抓完整頁再 indexOf 全域比對會把別人的直播誤判成這個頻道在開台。
const VIDEO_DETAILS_LIVE = /"videoDetails":\{"videoId":"([\w-]{11})"[\s\S]{0,200}?"isLive":true/;

const TIMEOUT_MS = 2500;

// AbortSignal.timeout() 理論上該中止逾時的請求，但實測 TCP connect 階段卡住（例如
// 網路完全連不到 youtube.com）時，undici 有自己內建 10 秒的 connect timeout，abort
// 訊號沒能提前把它砍斷——整批查詢還是被拖到快 10 秒。改成用 Promise.race 在 JS
// 這層強制設一個不依賴底層 fetch 是否配合中止的硬上限：時間一到就直接回傳「沒開台」，
// 底下真正的 fetch 就讓它自己在背景收尾，不擋住外層 Promise.all。
function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(fallback), ms);
    promise.then(
      v => {
        clearTimeout(timer);
        resolve(v);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      }
    );
  });
}

async function checkLive(channelHref: string): Promise<LiveInfo> {
  const liveUrl = `${channelHref.replace(/\/+$/, "")}/live`;
  const controller = new AbortController();

  const run = (async (): Promise<LiveInfo> => {
    try {
      const res = await fetch(liveUrl, {
        redirect: "follow",
        headers: { "User-Agent": UA, "Accept-Language": "ja,en;q=0.8" },
        next: { revalidate: 60 },
        signal: controller.signal,
      });
      if (!res.ok) return { live: false };

      const html = await res.text();
      const match = html.match(VIDEO_DETAILS_LIVE);
      if (!match) return { live: false };
      return { live: true, url: `https://www.youtube.com/watch?v=${match[1]}` };
    } catch {
      return { live: false };
    }
  })();

  return withTimeout(run, TIMEOUT_MS, { live: false }).finally(() => controller.abort());
}

export async function GET() {
  const vtubers = LIKE_CATEGORIES.find(c => c.key === "vtuber")?.items ?? [];
  const hrefs = Array.from(new Set(vtubers.map(v => v.href).filter((h): h is string => !!h)));

  const entries = await Promise.all(hrefs.map(async href => [href, await checkLive(href)] as const));

  const map: Record<string, LiveInfo> = {};
  entries.forEach(([href, info]) => {
    map[href] = info;
  });

  return NextResponse.json(map);
}
