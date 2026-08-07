// shields.io 風格的 SVG badge 產生器，給 /api/badge/* 用。
// 沒有依賴、沒有外部字型：寬度用字元數粗估，文字用系統 sans-serif。

const HEIGHT = 20;
const PAD_X = 8;

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 字級 11 的粗估字寬：CJK 約 13px、拉丁/數字約 7px
function textWidth(text: string) {
  let w = 0;
  for (const ch of text) {
    w += (ch.codePointAt(0) ?? 0) > 0x2e80 ? 13 : 7;
  }
  return w + 4;
}

export function shieldBadge(
  label: string,
  value: string,
  color: string,
  labelColor = "#4b5263"
): string {
  const lw = textWidth(label) + PAD_X * 2;
  const vw = textWidth(value) + PAD_X * 2;
  const total = lw + vw;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${total}" height="${HEIGHT}" role="img" aria-label="${escapeXml(
    label
  )}: ${escapeXml(value)}">
  <clipPath id="a"><rect width="${total}" height="${HEIGHT}" rx="3"/></clipPath>
  <g clip-path="url(#a)">
    <rect width="${lw}" height="${HEIGHT}" fill="${labelColor}"/>
    <rect x="${lw}" width="${vw}" height="${HEIGHT}" fill="${color}"/>
    <text x="${Math.floor(lw / 2)}" y="13.5" text-anchor="middle" font-family="DejaVu Sans, Verdana, sans-serif" font-size="11" fill="#fff" opacity="0.9">${escapeXml(
      label
    )}</text>
    <text x="${Math.floor(lw + vw / 2)}" y="13.5" text-anchor="middle" font-family="DejaVu Sans, Verdana, sans-serif" font-size="11" fill="#fff">${escapeXml(
      value
    )}</text>
  </g>
</svg>`;

  return svg;
}

export function svgResponse(svg: string, revalidateSec: number) {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": `public, max-age=${revalidateSec}`,
    },
  });
}
