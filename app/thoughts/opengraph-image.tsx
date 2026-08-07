import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "一些廢話 | itousouta.me";

export default function Image() {
  return renderOg({
    kicker: "THOUGHTS",
    title: "一些廢話",
    desc: "同步 Threads / GitHub / Discord",
  });
}
