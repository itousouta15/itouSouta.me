import { renderOg } from "../lib/ogImage";

export { size, contentType } from "../lib/ogImage";
export const alt = "一些文章 | itousouta.me";

export default function Image() {
  return renderOg({
    kicker: "BLOG",
    title: "一些文章",
    desc: "itouBLoGa · blog.itousouta.me",
  });
}
