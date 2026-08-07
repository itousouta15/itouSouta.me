import { LIKE_CATEGORIES } from "../../data";
import { renderOg } from "../../lib/ogImage";

export { size, contentType } from "../../lib/ogImage";
export const alt = "喜歡的東西 | itousouta.me";

// 沒有這行，這條路由會轉成動態，整個「build 時靜態產出」的前提就沒了
export function generateStaticParams() {
  return LIKE_CATEGORIES.map((cat) => ({ category: cat.key }));
}

export default function Image({ params }: { params: { category: string } }) {
  const cat = LIKE_CATEGORIES.find((c) => c.key === params.category);
  return renderOg({
    kicker: cat?.en ?? "LIKES",
    title: cat?.label ?? "喜歡的東西",
    desc: cat ? `${cat.items.length} 個收藏` : undefined,
  });
}
