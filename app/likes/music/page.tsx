import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "../../components/PageHead";
import LikeFilterGrid from "../../components/likes/LikeFilterGrid";
import { getTopTracks } from "../../lib/spotify";
import type { Like } from "../../data";
import { pageMetadata } from "../../lib/seo";

const description =
  "itouSouta 最常聽的音樂：從 Spotify 撈出來的長期愛聽清單，VOCALOID 和日本樂團佔了一大半 (⁎⁍̴̛ᴗ⁍̴̛⁎)";

export const revalidate = 3600;

export const metadata: Metadata = pageMetadata({
  title: "音樂",
  description,
  path: "/likes/music",
});

export default async function MusicDetailPage() {
  const topAlbums = await getTopTracks({ limit: 50, timeRange: "long_term" });
  const items: Like[] = (topAlbums ?? []).map((a) => ({
    title: a.title,
    sub: a.artist,
    cover: a.cover,
    href: a.href,
  }));

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="MUSIC" title="音樂" back="/likes" />
      <Suspense fallback={null}>
        <LikeFilterGrid items={items} layout="square" />
      </Suspense>
    </section>
  );
}
