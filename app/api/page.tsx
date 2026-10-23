import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "../components/PageHead";
import { pageMetadata } from "../lib/seo";
import { available } from "../template/availability";
import { site } from "../template/config";

export const metadata: Metadata = pageMetadata({
  title: "API",
  description: `${site.title} 的公開端點與訂閱來源。`,
  path: "/api",
});

interface Endpoint {
  method: "GET" | "POST";
  path: string;
  desc: string;
  enabled?: boolean;
}

const ENDPOINTS: Endpoint[] = [
  { method: "GET", path: "/writing/feed.xml", desc: "文章 RSS 訂閱來源。" },
  { method: "GET", path: "/feed.xml", desc: "近期動態 RSS 訂閱來源。" },
  { method: "GET", path: "/sitemap.xml", desc: "網站地圖。" },
  { method: "GET", path: "/api/search-index", desc: "文章與動態搜尋索引。" },
  {
    method: "GET",
    path: "/api/github-contributions",
    desc: "GitHub 貢獻資料。",
    enabled: available.github,
  },
  {
    method: "GET",
    path: "/api/now-playing",
    desc: "目前播放的音樂。",
    enabled: available.spotify || available.discord,
  },
  {
    method: "GET",
    path: "/api/vtuber-live",
    desc: "直播狀態。",
    enabled: available.vtuberLive,
  },
  {
    method: "GET",
    path: "/api/badge/discord",
    desc: "Discord 狀態徽章。",
    enabled: available.discord,
  },
  {
    method: "GET",
    path: "/api/badge/stars",
    desc: "GitHub 星數徽章。",
    enabled: available.github,
  },
  { method: "GET", path: "/api/badge/blog", desc: "最新文章徽章。" },
  {
    method: "GET",
    path: "/api/guestbook",
    desc: "留言列表。",
    enabled: available.guestbook,
  },
  {
    method: "POST",
    path: "/api/guestbook",
    desc: "新增留言。",
    enabled: available.guestbook,
  },
  {
    method: "GET",
    path: "/api/impressions",
    desc: "訪客留印。",
    enabled: available.impressions,
  },
  {
    method: "POST",
    path: "/api/impressions",
    desc: "留下印象。",
    enabled: available.impressions,
  },
  {
    method: "GET",
    path: "/api/reactions",
    desc: "動態按讚數。",
    enabled: available.reactions,
  },
  {
    method: "POST",
    path: "/api/reactions",
    desc: "按讚。",
    enabled: available.reactions,
  },
];

export default function ApiPage() {
  if (!available.publicApi) notFound();

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead
        kicker="API"
        title="公開端點"
        desc={`${site.title} 的資料與訂閱來源`}
      />
      {ENDPOINTS.filter((endpoint) => endpoint.enabled !== false).map(
        (endpoint) => (
          <div
            className="api-endpoint"
            key={`${endpoint.method}-${endpoint.path}`}
          >
            <div className="api-endpoint-head">
              <span
                className={`api-method api-method-${endpoint.method.toLowerCase()}`}
              >
                {endpoint.method}
              </span>
              <code className="api-path">{endpoint.path}</code>
            </div>
            <p className="api-desc">{endpoint.desc}</p>
            <pre className="api-curl">{`curl ${endpoint.method === "POST" ? "-X POST " : ""}${site.url}${endpoint.path}`}</pre>
          </div>
        )
      )}
    </section>
  );
}
