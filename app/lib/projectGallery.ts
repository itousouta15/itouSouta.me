import type { Project, ProjectScreenshot } from "../data/projects";

export function getProjectScreenshots(
  project: Pick<Project, "title" | "cover" | "screenshots">
): ProjectScreenshot[] {
  const seen = new Set<string>();
  return [
    { src: project.cover, alt: `${project.title} 預覽圖` },
    ...(project.screenshots ?? []),
  ].flatMap((image) => {
    const src = image.src.trim();
    if (!src || seen.has(src)) return [];
    seen.add(src);
    return [
      { ...image, src, alt: image.alt.trim() || `${project.title} 畫面` },
    ];
  });
}
