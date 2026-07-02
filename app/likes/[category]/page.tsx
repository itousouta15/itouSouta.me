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
  const title = cat ? cat.label : "喜歡的東西";
  const description = cat
    ? `itouSouta 喜歡的${cat.label}整理清單。`
    : "itouSouta 喜歡的音樂、VOCALOID 作品、動漫與其他事物整理。";
  const url = `/likes/${params.category}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | itouSouta15.tw`, description, url },
    twitter: { title: `${title} | itouSouta15.tw`, description },
  };
}

export default function LikeCategoryPage({ params }: { params: { category: string } }) {
  const cat = LIKE_CATEGORIES.find(c => c.key === params.category);
  if (!cat) notFound();

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker={cat.en} title={cat.label} back="/likes" />
      <LikeFilterGrid items={cat.items} layout={cat.layout} />
    </section>
  );
}
