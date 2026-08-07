import { renderOg } from "../../lib/ogImage";

export { size, contentType } from "../../lib/ogImage";
export const alt = "音樂 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "MUSIC", title: "常聽的音樂" });
}
