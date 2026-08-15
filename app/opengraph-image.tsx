// OG 版面版本：2026-08-15c —— 改完 lib/ogImage.tsx 的版面後，要把這行日期往前
// 推，否則 og:image 的網址不會變，各平台會一直餵舊圖（原因見 lib/ogImage.tsx 開頭）
import { renderOg } from "./lib/ogImage";

export { size, contentType } from "./lib/ogImage";
export const alt = "itousouta.me";

/* 放在根 segment，所以這張同時也是所有「沒有自己的 opengraph-image」的路由的預設
   分享圖（Next 的檔案慣例會往子路由繼承）。 */
export default function Image() {
  return renderOg({
    kicker: "ITOUSOUTA.ME",
    title: "伊藤蒼太",
    desc: "郭家睿 / itouSouta 的個人網站",
  });
}
