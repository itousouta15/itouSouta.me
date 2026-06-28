import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import LikeCategorySection from "../components/LikeCategorySection";
import MusicSection from "../components/MusicSection";
import { LIKE_CATEGORIES } from "../data";

export const metadata: Metadata = { title: "喜歡的東西 | itousouta15.tw" };

export default function LikesPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="LIKES" title="喜歡的東西" />
      {LIKE_CATEGORIES.map(cat => (
        <LikeCategorySection cat={cat} key={cat.key} />
      ))}
      <MusicSection />
    </section>
  );
}
