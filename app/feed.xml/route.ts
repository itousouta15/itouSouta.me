import { getMergedThoughts } from "../lib/mergedThoughts";

const SITE_URL = "https://itousouta15.tw";
const TITLE = "itouSouta15.tw 雜談";
const DESCRIPTION = "itouSouta 的雜談與生活紀錄，隨手記下的想法與日常。";

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
    .map(item => {
      const link = item.kind === "threads" ? item.permalink : item.kind === "github" ? item.url : SITE_URL + "/thoughts";
      const title = item.text ? item.text.slice(0, 60) : `雜談 ${item.date}`;
      return `<item>
  <title>${escapeXml(title)}</title>
  <link>${escapeXml(link ?? SITE_URL + "/thoughts")}</link>
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
  <link>${SITE_URL}/thoughts</link>
  <description>${escapeXml(DESCRIPTION)}</description>
  <language>zh-TW</language>
  ${itemsXml}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
