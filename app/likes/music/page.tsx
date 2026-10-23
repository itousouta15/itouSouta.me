import type { Metadata } from "next";
import PageHead from "../../components/PageHead";
import MusicGrid from "../../components/likes/MusicGrid";
import { getMusicSnapshot } from "../../lib/music";
import { pageMetadata } from "../../lib/seo";
import { notFound } from "next/navigation";
import { available } from "../../template/availability";
import { site } from "../../template/config";

const description = `${site.author.name} 在 Spotify 最常聽的音樂。`;

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "音樂",
  description,
  path: "/likes/music",
});

export default async function MusicDetailPage() {
  if (!available.spotify) notFound();
  const music = await getMusicSnapshot({ limit: 50, timeRange: "long_term" });

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="MUSIC" title="音樂" back="/likes" />
      <MusicGrid tracks={music.tracks} />
    </section>
  );
}
