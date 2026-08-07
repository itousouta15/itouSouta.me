import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "一些專案們 | itousouta.me";

export default function Image() {
  return renderOg({ kicker: "PROJECTS", title: "一些專案們" });
}
