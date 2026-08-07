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
