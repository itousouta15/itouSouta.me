import { NextResponse } from "next/server";
import { LIKE_CATEGORIES } from "../../data";

// 兩種來源：
// 1. VSPO 官方排程站（vspo-schedule.com）— 它自己維護全體 VSPO 成員的開台狀態，
//    首頁 HTML 就內嵌完整 JSON（含 channelId/status/link），一次請求可以拿到全員資料，
//    不用一個個打 YouTube。VSPO 成員都走這條。
// 2. YouTube 官方 /live 頁面 — 土法煉鋼逐頻道檢查，只給非 VSPO（沒有 channelId 可對應）的
//    VTuber 用，作為 fallback。
export const revalidate = 60;

interface LiveInfo {
  live: boolean;
  url?: string;
}

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const TIMEOUT_MS = 2500;

// AbortSignal.timeout() 理論上該中止逾時的請求，但實測 TCP connect 階段卡住（例如
// 網路完全連不到目標網站）時，undici 有自己內建 10 秒的 connect timeout，abort
// 訊號沒能提前把它砍斷——整批查詢還是被拖到快 10 秒。改成用 Promise.race 在 JS
// 這層強制設一個不依賴底層 fetch 是否配合中止的硬上限：時間一到就直接回傳 fallback，
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

// --- VSPO 排程站：一次請求拿全體成員的開台狀態 ---

const SCHEDULE_URL = "https://www.vspo-schedule.com/tw/schedule/live";

// Next.js RSC 會把 server component 算出的資料序列化成 JS 字串，用
// self.__next_f.push([1, "...轉義過的內容..."]) 這種形式一段段塞進 <script> 標籤，
// 同一筆資料常常橫跨好幾個 push 呼叫，所以不能直接對單一段落做字串比對，
// 得先把所有段落解碼、接起來，再對整段結果做搜尋。
const PUSH_CHUNK = /self\.__next_f\.push\(\[1,"((?:[^"\\]|\\.)*)"\]\)/g;

function decodeChunk(raw: string): string | null {
  try {
    // push 進去的內容本身是 JSON 字串轉義規則（\"、\\、\n...），套殼成合法 JSON
    // 字串常值再交給 JSON.parse 解碼，比手刻一套轉義規則可靠。
    return JSON.parse(`"${raw}"`);
  } catch {
    return null;
  }
}

// 每筆直播資料是攤平的物件，欄位順序固定（id → type → ... → channelId → ... →
// status → scheduledStartTime → scheduledEndTime），用非貪婪比對取到
// scheduledEndTime 收尾，避免像 tags 那種長度不固定的陣列把邊界撐爆到下一筆。
const STREAM_ENTRY = /\{"id":"[\w-]{11}","type":"livestream",[\s\S]*?"scheduledEndTime":(?:null|"[^"]*")\}/g;

async function fetchScheduleLiveMap(): Promise<Map<string, LiveInfo> | null> {
  const run = (async (): Promise<Map<string, LiveInfo> | null> => {
    try {
      const res = await fetch(SCHEDULE_URL, {
        headers: { "User-Agent": UA, "Accept-Language": "zh-TW,zh;q=0.9" },
        next: { revalidate: 60 },
      });
      if (!res.ok) return null;

      const html = await res.text();
      let flight = "";
      for (const m of html.matchAll(PUSH_CHUNK)) {
        const decoded = decodeChunk(m[1]);
        if (decoded) flight += decoded;
      }

      const entries = Array.from(flight.matchAll(STREAM_ENTRY));
      // 一筆都沒找到代表排程站可能改版、解析邏輯已經失效，回傳 null 讓呼叫端
      // 對「本來就沒人開台」跟「解析壞掉」做出不同反應（後者要 fallback 逐台檢查）。
      if (entries.length === 0) return null;

      const map = new Map<string, LiveInfo>();
      for (const entry of entries) {
        const text = entry[0];
        const channelId = text.match(/"channelId":"(UC[\w-]{20,26})"/)?.[1];
        const status = text.match(/"status":"(live|upcoming|ended)"/)?.[1];
        const link = text.match(/"link":"([^"]*)"/)?.[1];
        if (!channelId || status !== "live") continue;
        map.set(channelId, { live: true, url: link || undefined });
      }
      return map;
    } catch {
      return null;
    }
  })();

  return withTimeout(run, TIMEOUT_MS, null);
}

// --- YouTube /live 逐頻道檢查（fallback，只給沒有 channelId 可對應的頻道用）---

// YouTube 對 /live 這條路徑不是發 302，而是直接把該頁 render 成當前直播（或最近一支影片）的
// watch 頁內容，網址列還是停在 /live。所以不能看 res.url，得整頁抓下來看內嵌的 ytInitialPlayerResponse。
// 且 "isLive":true 這個字串在整頁到處都會出現（推薦影片、其他人的直播卡片等等），
// 只在 videoDetails 開頭那小段（videoId → title → lengthSeconds → isLive）找才準，
// 抓完整頁再 indexOf 全域比對會把別人的直播誤判成這個頻道在開台。
const VIDEO_DETAILS_LIVE = /"videoDetails":\{"videoId":"([\w-]{11})"[\s\S]{0,200}?"isLive":true/;

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

function channelIdFromHref(href: string): string | undefined {
  return href.match(/\/channel\/(UC[\w-]{20,26})/)?.[1];
}

export async function GET() {
  const vtubers = LIKE_CATEGORIES.find(c => c.key === "vtuber")?.items ?? [];

  const scheduleMap = await fetchScheduleLiveMap();

  const map: Record<string, LiveInfo> = {};
  const needsFallback: string[] = [];

  for (const v of vtubers) {
    if (!v.href) continue;
    const channelId = v.channelId ?? channelIdFromHref(v.href);
    if (channelId && scheduleMap) {
      map[v.href] = scheduleMap.get(channelId) ?? { live: false };
    } else {
      needsFallback.push(v.href);
    }
  }

  if (needsFallback.length > 0) {
    const uniqueHrefs = Array.from(new Set(needsFallback));
    const entries = await Promise.all(uniqueHrefs.map(async href => [href, await checkLive(href)] as const));
    entries.forEach(([href, info]) => {
      map[href] = info;
    });
  }

  return NextResponse.json(map);
}
