import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import LikeCategorySection from "../components/likes/LikeCategorySection";
import MusicSection from "../components/likes/MusicSection";
import VtuberLiveWarmup from "../components/likes/VtuberLiveWarmup";
import { LIKE_CATEGORIES } from "../data";
import { getMusicSnapshot } from "../lib/music";
import { pageMetadata } from "../lib/seo";
import { features, site } from "../template/config";
import { available } from "../template/availability";

const description = `${site.author.name} 喜歡的作品與音樂。`;

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "喜歡的東西",
  description,
  path: "/likes",
});

export default async function LikesPage() {
  const music = available.spotify
    ? await getMusicSnapshot({ limit: 12, timeRange: "long_term" })
    : { tracks: [] };

  return (
    <section style={{ paddingBottom: 8 }}>
      {features.vtuberLive && <VtuberLiveWarmup />}
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map((cat, i) => (
        <LikeCategorySection cat={cat} key={cat.key} priorityImages={i === 0} />
      ))}
      {music.tracks.length > 0 && <MusicSection {...music} />}
    </section>
  );
}
