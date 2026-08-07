import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "友鏈 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "LINKS", title: "友鏈" });
}
