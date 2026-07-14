import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import LikeCategorySection from "../components/LikeCategorySection";
import MusicSection from "../components/MusicSection";
import { LIKE_CATEGORIES } from "../data";
import { getTopAlbums } from "../lib/lastfm";

const description = "itouSouta 喜歡的音樂、VOCALOID 、動漫 (╯✧∇✧)╯";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "喜歡的東西",
  description,
  alternates: { canonical: "/likes" },
  openGraph: { title: "喜歡的東西 | itousouta.me", description, url: "/likes" },
  twitter: { title: "喜歡的東西 | itousouta.me", description },
};

export default async function LikesPage() {
  const topAlbums = await getTopAlbums({ limit: 12, period: "overall" });

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map(cat => (
        <LikeCategorySection cat={cat} key={cat.key} />
      ))}
      {topAlbums && topAlbums.length > 0 && <MusicSection albums={topAlbums} />}
    </section>
  );
}
