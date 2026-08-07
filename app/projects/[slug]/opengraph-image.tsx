import { PROJECTS } from "../../data";
import { renderOg } from "../../lib/ogImage";

export { size, contentType } from "../../lib/ogImage";
export const alt = "專案 | itousouta.me";

// 沒有這行，這條路由會轉成動態，整個「build 時靜態產出」的前提就沒了
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default function Image({ params }: { params: { slug: string } }) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  return renderOg({
    kicker: project?.kicker ?? "PROJECT",
    title: project?.title ?? "專案",
    desc: project?.desc,
  });
}
