import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "喜歡的東西 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "LIKES", title: "喜歡的東西" });
}
