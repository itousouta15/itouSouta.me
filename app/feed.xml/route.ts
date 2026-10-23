import { getMergedThoughts } from "../lib/mergedThoughts";
import { SITE_URL, SITE_TITLE } from "../lib/seo";
import { site } from "../template/config";

const TITLE = `${SITE_TITLE} 動態`;
const DESCRIPTION = `${site.author.name} 的生活紀錄與近期動態。`;

export const revalidate = 3600;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = await getMergedThoughts();

  const itemsXml = items
    .slice(0, 50)
    .map((item) => {
      const link =
        item.kind === "threads"
          ? item.permalink
          : item.kind === "github"
            ? item.url
            : SITE_URL + "/writing?view=thoughts";
      const title = item.text ? item.text.slice(0, 60) : `雜談 ${item.date}`;
      return `<item>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(link ?? SITE_URL + "/writing")}</link>
  <guid isPermaLink="false">${escapeXml(item.id)}</guid>
  <pubDate>${new Date(item.timestamp).toUTCString()}</pubDate>
  ${item.text ? `<description>${escapeXml(item.text)}</description>` : ""}
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${escapeXml(TITLE)}</title>
  <link>${SITE_URL}/writing?view=thoughts</link>
  <description>${escapeXml(DESCRIPTION)}</description>
  <language>zh-TW</language>
  ${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
