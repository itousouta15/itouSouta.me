import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "../../components/PageHead";
import LikeFilterGrid from "../../components/LikeFilterGrid";
import { LIKE_CATEGORIES } from "../../data";

export function generateStaticParams() {
  return LIKE_CATEGORIES.map(cat => ({ category: cat.key }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const cat = LIKE_CATEGORIES.find(c => c.key === params.category);
  return { title: cat ? `${cat.label} | itousouta15.tw` : "喜歡的東西 | itousouta15.tw" };
}

export default function LikeCategoryPage({ params }: { params: { category: string } }) {
  const cat = LIKE_CATEGORIES.find(c => c.key === params.category);
  if (!cat) notFound();

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker={cat.en} title={cat.label} back="/likes" />
      <LikeFilterGrid items={cat.items} />
    </section>
  );
}
