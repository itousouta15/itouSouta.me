// OG 版面版本：2026-08-11 —— 改完 lib/ogImage.tsx 的版面後，要把這行日期往前
// 推，否則 og:image 的網址不會變，各平台會一直餵舊圖（原因見 lib/ogImage.tsx 開頭）
import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "itousouta.me 的一些廢話 φ(*￣0￣)";

export default function Image() {
  return renderOg({
    kicker: "WRITING",
    title: "碎碎念",
    desc: "itouBLoGa · Threads · GitHub · Discord",
  });
}
