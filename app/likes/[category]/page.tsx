import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHead from "../../components/PageHead";
import LikeFilterGrid from "../../components/likes/LikeFilterGrid";
import { LIKE_CATEGORIES } from "../../data";
import { pageMetadata } from "../../lib/seo";

export function generateStaticParams() {
  return LIKE_CATEGORIES.map((cat) => ({ category: cat.key }));
}

export function generateMetadata({
  params,
}: {
  params: { category: string };
}): Metadata {
  const cat = LIKE_CATEGORIES.find((c) => c.key === params.category);
  const title = cat ? cat.label : "喜歡的東西";
  const description = cat
    ? `itouSouta 收藏的${cat.label}清單，共 ${cat.items.length} 部，每一部都有我自己的評分和一點心得 (╯✧∇✧)╯`
    : "itouSouta 喜歡的輕小說、漫畫、動漫、VTuber 與 VOCALOID 音樂收藏 (╯✧∇✧)╯";

  return pageMetadata({
    title,
    description,
    path: `/likes/${params.category}`,
  });
}

export default function LikeCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const cat = LIKE_CATEGORIES.find((c) => c.key === params.category);
  if (!cat) notFound();

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker={cat.en} title={cat.label} back="/likes" />
      <Suspense fallback={null}>
        <LikeFilterGrid items={cat.items} layout={cat.layout} />
      </Suspense>
    </section>
  );
}
