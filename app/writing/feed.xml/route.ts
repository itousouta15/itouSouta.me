import { getPublishedPosts } from "../../lib/posts";
import { SITE_URL } from "../../lib/seo";

export const revalidate = 3600;
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const posts = getPublishedPosts();
  const items = posts
    .map(
      (post) =>
        `<item><title>${escapeXml(post.title)}</title><link>${SITE_URL}${post.path}</link><guid isPermaLink="true">${SITE_URL}${post.path}</guid><pubDate>${new Date(post.timestamp).toUTCString()}</pubDate><description>${escapeXml(post.description)}</description>${post.categories.map((category) => `<category>${escapeXml(category)}</category>`).join("")}</item>`
    )
    .join("\n");
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>itouBLoGa · itouSouta.me</title><link>${SITE_URL}/writing</link><description>itouSouta 的技術文章與生活紀錄</description><language>zh-TW</language><atom:link href="${SITE_URL}/writing/feed.xml" rel="self" type="application/rss+xml"/>${posts[0] ? `<lastBuildDate>${new Date(posts[0].timestamp).toUTCString()}</lastBuildDate>` : ""}${items}</channel></rss>`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } }
  );
}
