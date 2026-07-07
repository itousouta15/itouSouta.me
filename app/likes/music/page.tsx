import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "../../components/PageHead";
import LikeFilterGrid from "../../components/LikeFilterGrid";
import { getTopAlbums } from "../../lib/lastfm";
import type { Like } from "../../data";

const description = "itouSouta 喜歡聽的音樂們 (⁎⁍̴̛ᴗ⁍̴̛⁎)";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "音樂",
  description,
  alternates: { canonical: "/likes/music" },
  openGraph: { title: "音樂 | itouSouta15.tw", description, url: "/likes/music" },
  twitter: { title: "音樂 | itouSouta15.tw", description },
};

export default async function MusicDetailPage() {
  const topAlbums = await getTopAlbums({ limit: 50, period: "overall" });
  const items: Like[] = (topAlbums ?? []).map(a => ({
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
