import type { Metadata } from "next";
import PageHead from "../../components/PageHead";
import MusicArtistCard from "../../components/MusicArtistCard";
import { MUSIC_ARTISTS } from "../../data";

const description = "itouSouta 喜歡的音樂人與 VOCALOID 歌曲整理清單。";

export const metadata: Metadata = {
  title: "音樂",
  description,
  alternates: { canonical: "/likes/music" },
  openGraph: { title: "音樂 | itouSouta15.tw", description, url: "/likes/music" },
  twitter: { title: "音樂 | itouSouta15.tw", description },
};

export default function MusicDetailPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="MUSIC" title="音樂" back="/likes" />
      <div className="music-artist-col">
        {MUSIC_ARTISTS.map((artist, index) => (
          <MusicArtistCard artist={artist} index={index} key={artist.name} />
        ))}
      </div>
    </section>
  );
}
