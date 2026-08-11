import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import LikeCategorySection from "../components/LikeCategorySection";
import MusicSection from "../components/MusicSection";
import VtuberLiveWarmup from "../components/VtuberLiveWarmup";
import { LIKE_CATEGORIES } from "../data";
import { getTopTracks } from "../lib/spotify";
import { pageMetadata } from "../lib/seo";

const description =
  "itouSouta 喜歡的東西：輕小說、漫畫、動漫、VTuber 與 VOCALOID 音樂的收藏清單，每一部都有我自己的評分和一點心得 (╯✧∇✧)╯";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "喜歡的東西",
  description,
  path: "/likes",
});

export default async function LikesPage() {
  const topAlbums = await getTopTracks({ limit: 12, timeRange: "long_term" });

  return (
    <section style={{ paddingBottom: 8 }}>
      <VtuberLiveWarmup />
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map((cat) => (
        <LikeCategorySection cat={cat} key={cat.key} />
      ))}
      {topAlbums && topAlbums.length > 0 && <MusicSection albums={topAlbums} />}
    </section>
  );
}
