import { getPublishedPosts } from "../../../lib/posts";
import { shieldBadge, svgResponse } from "../../../lib/badge";
import { features } from "../../../template/config";

// Badge for the latest article.
// 標題截到 44 個字，太長直接斷字，SVG 不換行。

export const revalidate = 3600;

export async function GET() {
  if (!features.publicApi)
    return Response.json({ error: "Not found" }, { status: 404 });
  let title = "no posts yet";
  const newest = getPublishedPosts()[0];
  if (newest?.title) {
    title =
      newest.title.length > 44 ? `${newest.title.slice(0, 43)}…` : newest.title;
  }
  return svgResponse(shieldBadge("blog", title, "#57606a"), 3600);
}
