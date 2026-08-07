import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "數據 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "STATS", title: "一些數字" });
}
