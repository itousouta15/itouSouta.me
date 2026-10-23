import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import PageHead from "../../components/PageHead";
import LikeFilterGrid from "../../components/likes/LikeFilterGrid";
import { LIKE_CATEGORIES } from "../../data";
import { pageMetadata } from "../../lib/seo";
import { site } from "../../template/config";

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
    ? `${site.author.name} 收藏的${cat.label}清單，共 ${cat.items.length} 個項目。`
    : `${site.author.name} 的收藏清單。`;

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
