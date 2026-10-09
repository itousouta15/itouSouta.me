import type { Metadata } from "next";
import PageHead from "../../components/PageHead";
import MusicGrid from "../../components/likes/MusicGrid";
import MusicRecordingNote from "../../components/likes/MusicRecordingNote";
import { getMusicSnapshot } from "../../lib/music";
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
  const music = await getMusicSnapshot({ limit: 50, timeRange: "long_term" });

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="MUSIC" title="音樂" back="/likes" />
      <MusicRecordingNote recording={music.recording} />
      <MusicGrid tracks={music.tracks} />
    </section>
  );
}
