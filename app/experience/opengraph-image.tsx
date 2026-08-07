import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "經歷 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "EXPERIENCE", title: "經歷" });
}
