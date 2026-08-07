import { getBlogPosts } from "../../../lib/blogFeed";
import { shieldBadge, svgResponse } from "../../../lib/badge";

// 部落格最新一篇徽章：https://itousouta.me/api/badge/blog.svg
// 標題截到 44 個字，太長直接斷字，SVG 不換行。

export const revalidate = 3600;

export async function GET() {
  let title = "no posts yet";
  const posts = await getBlogPosts().catch(() => []);
  const newest = posts.reduce(
    (max, p) => (p.timestamp > (max?.timestamp ?? 0) ? p : max),
    posts[0]
  );
  if (newest?.title) {
    title =
      newest.title.length > 44 ? `${newest.title.slice(0, 43)}…` : newest.title;
  }
  return svgResponse(shieldBadge("blog", title, "#57606a"), 3600);
}
