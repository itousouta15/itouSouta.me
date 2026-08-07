import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "關於我 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "ABOUT", title: "關於我" });
}
