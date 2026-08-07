import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { EXPERIENCE, LIKE_CATEGORIES, LINKS, PROJECTS } from "../data";
import { getAllRepoInfo } from "../lib/github";
import { getBlogPosts } from "../lib/blogFeed";
import { getMergedThoughts } from "../lib/mergedThoughts";
import { getTopTracks } from "../lib/spotify";

const description = "itousouta.me 的一些數字 (｡･ω･｡)";

export const metadata: Metadata = {
  title: "數據",
  description,
  alternates: { canonical: "/stats" },
  openGraph: { title: "數據 | itousouta.me", description, url: "/stats" },
  twitter: { title: "數據 | itousouta.me", description },
};

export const revalidate = 3600;

function Stat({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="stat">
      <div className="stat-k">{k}</div>
      <div className={`stat-v${mono ? " mono" : " sans"}`}>{v}</div>
    </div>
  );
}

/* 各區塊都包在 .card 裡，而不是把 .stat 加進 globals.css 的 backdrop-filter 名單。
   .stat 用 var(--inset) 當底色、刻意不在名單內——在 /about 它躺在有磨砂的
   .about-main 裡所以看起來對；這頁沒有磨砂的祖先，玻璃模式下就會顯得死板。
   .card 本來就在名單裡，包一層是最省事也最安全的作法（不會多一個 fixed 定位的
   containing block 問題）。 */
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
      <PageHead kicker="STATS" title="一些數字" desc={description} />

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
