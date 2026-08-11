import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { pageMetadata } from "../lib/seo";

// 頁面上那行小字，跟給搜尋引擎看的描述分開：前者要短，後者要塞得下關鍵字
const lead = "itousouta.me 的公開端點與徽章";

const description =
  "itousouta.me 的公開 API：雜談 RSS feed、sitemap、站內搜尋索引，以及部落格文章數、GitHub 星數、Discord 狀態的動態徽章，全部可以直接 curl";

export const metadata: Metadata = pageMetadata({
  title: "API",
  description,
  path: "/api",
});

interface Endpoint {
  method: string;
  path: string;
  desc: string;
  curl: string;
}

const ENDPOINTS: Endpoint[] = [
  {
    method: "GET",
    path: "/feed.xml",
    desc: "雜談的 RSS 2.0 feed，供 RSS 閱讀器訂閱。",
    curl: "curl https://itousouta.me/feed.xml",
  },
  {
    method: "GET",
    path: "/sitemap.xml",
    desc: "站內所有頁面的 sitemap（含 lastModified）。",
    curl: "curl https://itousouta.me/sitemap.xml",
  },
  {
    method: "GET",
    path: "/api/search-index",
    desc: "Cmd+K 全站搜尋索引：部落格文章（external URL）＋最近 20 筆雜談。",
    curl: "curl https://itousouta.me/api/search-index",
  },
  {
    method: "GET",
    path: "/api/vtuber-live",
    desc: "收藏裡所有 VTuber 的開台狀態（VSPO 排程站 + YouTube fallback），60 秒快取。",
    curl: "curl https://itousouta.me/api/vtuber-live",
  },
  {
    method: "GET",
    path: "/api/now-playing",
    desc: "正在聽的 Spotify 曲目（直打 Spotify API，缺憑證時退回 Lanyard）；沒有在聽時回 null。",
    curl: "curl https://itousouta.me/api/now-playing",
  },
  {
    method: "GET",
    path: "/api/badge/discord",
    desc: "Discord 狀態徽章（online / idle / do not disturb / offline），貼 README 用。",
    curl: "curl https://itousouta.me/api/badge/discord",
  },
  {
    method: "GET",
    path: "/api/badge/stars",
    desc: "全部專案的 GitHub 星數加總徽章。",
    curl: "curl https://itousouta.me/api/badge/stars",
  },
  {
    method: "GET",
    path: "/api/badge/blog",
    desc: "部落格最新一篇標題徽章。",
    curl: "curl https://itousouta.me/api/badge/blog",
  },
  {
    method: "GET",
    path: "/api/guestbook",
    desc: "留言板列表（最新在前）。",
    curl: "curl https://itousouta.me/api/guestbook",
  },
  {
    method: "POST",
    path: "/api/guestbook",
    desc: "送出留言，body {nick, text}。IP rate limit 5/hr，超過回 429。",
    curl: 'curl -X POST https://itousouta.me/api/guestbook -H "Content-Type: application/json" -d \'{"nick":"某人","text":"嗨"}\'',
  },
  {
    method: "GET",
    path: "/api/reactions?ids=a,b",
    desc: "雜談按讚計數，ids 用逗號分隔，回 {id: count}。",
    curl: 'curl "https://itousouta.me/api/reactions?ids=1,2"',
  },
  {
    method: "POST",
    path: "/api/reactions",
    desc: "雜談按讚，body {id}。IP rate limit 30/hr，超過回 429。",
    curl: 'curl -X POST https://itousouta.me/api/reactions -H "Content-Type: application/json" -d \'{"id":"abc"}\'',
  },
  {
    method: "POST",
    path: "/api/revalidate",
    desc: "外部服務（itouBot 發完碎碎念後）觸發 /writing 重新驗證。需 x-revalidate-secret header。",
    curl: 'curl -X POST https://itousouta.me/api/revalidate -H "x-revalidate-secret: $REVALIDATE_SECRET"',
  },
];

export default function ApiPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="API" title="公開端點" desc={lead} />

      {ENDPOINTS.map((e) => (
        <div className="api-endpoint" key={`${e.method}-${e.path}`}>
          <div className="api-endpoint-head">
            <span className={`api-method api-method-${e.method.toLowerCase()}`}>
              {e.method}
            </span>
            <code className="api-path">{e.path}</code>
          </div>
          <p className="api-desc">{e.desc}</p>
          <pre className="api-curl">{e.curl}</pre>
        </div>
      ))}
    </section>
  );
}
