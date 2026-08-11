import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { EXPERIENCE, LIKE_CATEGORIES, LINKS, PROJECTS } from "../data";
import { getAllRepoInfo } from "../lib/github";
import { getBlogPosts } from "../lib/blogFeed";
import { getMergedThoughts } from "../lib/mergedThoughts";
import { getTopTracks } from "../lib/spotify";
import { pageMetadata } from "../lib/seo";

// 頁面上那行小字，跟給搜尋引擎看的描述分開：前者要短，後者要塞得下關鍵字
const lead = "itousouta.me 的一些數字 (｡･ω･｡)";

const description = "itousouta.me 的統計數據 (｡･ω･｡)";

export const metadata: Metadata = pageMetadata({
  title: "數據",
  description,
  path: "/stats",
});

export const revalidate = 3600;

function Stat({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="stat">
      <div className="stat-k">{k}</div>
      <div className={`stat-v${mono ? " mono" : " sans"}`}>{v}</div>
    </div>
  );
}

/* 各區塊都包在 .card 裡，讓 .stat 的 var(--inset) 底色有個明確的容器。 */
function Section({
  kicker,
  children,
}: {
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card" style={{ marginTop: 20 }}>
      <div className="card-kicker">{kicker}</div>
      <div className="divider" />
      <div className="stat-grid">{children}</div>
    </div>
  );
}

export default async function StatsPage() {
  const [repoInfoBySlug, posts, thoughts, tracks] = await Promise.all([
    getAllRepoInfo(PROJECTS),
    getBlogPosts().catch(() => []),
    getMergedThoughts().catch(() => []),
    getTopTracks({ limit: 50, timeRange: "long_term" }).catch(() => null),
  ]);

  const infos = Object.values(repoInfoBySlug).filter((i) => i !== null);
  const totalStars = infos.reduce((sum, i) => sum + i.stars, 0);
  const languages = new Set(
    infos.map((i) => i.language).filter((l): l is string => !!l)
  );

  const allLikes = LIKE_CATEGORIES.flatMap((c) => c.items);
  const rated = allLikes.filter((l) => l.personRating != null);
  const avgRating = rated.length
    ? (
        rated.reduce((sum, l) => sum + (l.personRating ?? 0), 0) / rated.length
      ).toFixed(2)
    : "—";

  const expByCategory = new Map<string, number>();
  for (const e of EXPERIENCE) {
    const key = e.category ?? "其他";
    expByCategory.set(key, (expByCategory.get(key) ?? 0) + 1);
  }

  const artists = new Set(
    (tracks ?? []).flatMap((t) => t.artist.split(", ").filter(Boolean))
  );

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="STATS" title="一些數字" desc={lead} />

      <Section kicker="PROJECTS">
        <Stat k="專案數" v={String(PROJECTS.length)} mono />
        <Stat k="GitHub 總星數" v={String(totalStars)} mono />
        <Stat k="主要語言" v={String(languages.size)} mono />
        <Stat
          k="有線上版"
          v={String(PROJECTS.filter((p) => p.siteUrl).length)}
          mono
        />
      </Section>

      <Section kicker="LIKES">
        {LIKE_CATEGORIES.map((cat) => (
          <Stat key={cat.key} k={cat.label} v={String(cat.items.length)} mono />
        ))}
        <Stat k="平均評分" v={avgRating} mono />
      </Section>

      <Section kicker="EXPERIENCE">
        {[...expByCategory].map(([category, count]) => (
          <Stat key={category} k={category} v={String(count)} mono />
        ))}
        <Stat k="友鏈" v={String(LINKS.length)} mono />
      </Section>

      <Section kicker="FEEDS">
        <Stat k="部落格文章" v={String(posts.length)} mono />
        <Stat k="雜談" v={String(thoughts.length)} mono />
        {tracks && (
          <>
            <Stat k="常聽歌手" v={String(artists.size)} mono />
            <Stat k="最常聽" v={tracks[0]?.title ?? "—"} />
          </>
        )}
      </Section>
    </section>
  );
}
