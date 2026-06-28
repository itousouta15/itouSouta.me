import type { Metadata } from "next";
import PageHead from "../../components/PageHead";
import MusicArtistCard from "../../components/MusicArtistCard";
import { MUSIC_ARTISTS } from "../../data";

export const metadata: Metadata = { title: "音樂 | itousouta15.tw" };

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
