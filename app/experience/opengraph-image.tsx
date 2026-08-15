// OG 版面版本：2026-08-15c —— 改完 lib/ogImage.tsx 的版面後，要把這行日期往前
// 推，否則 og:image 的網址不會變，各平台會一直餵舊圖（原因見 lib/ogImage.tsx 開頭）
import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "經歷 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "EXPERIENCE", title: "經歷" });
}
