import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "itousouta.me 的文章與雜談";

export default function Image() {
  return renderOg({
    kicker: "WRITING",
    title: "文章與雜談",
    desc: "itouBLoGa · Threads · GitHub · Discord",
  });
}
