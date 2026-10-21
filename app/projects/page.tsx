import type { Metadata } from "next";
import { Suspense } from "react";
import { permanentRedirect } from "next/navigation";
import PageHead from "../components/PageHead";
import ProjectFilterGrid from "../components/projects/ProjectFilterGrid";
import { PROJECTS } from "../data";
import { getAllRepoInfo } from "../lib/github";
import { pageMetadata } from "../lib/seo";
import { findProject, projectPath } from "../lib/projectRoutes";

const description = "itouSouta 做過的專案們 (◍•ᴗ•◍)ゝ";

export const metadata: Metadata = pageMetadata({
  title: "一些專案們",
  description,
  path: "/projects",
});

export const revalidate = 3600;

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: {
    project?: string | string[];
    q?: string | string[];
    view?: string | string[];
  };
}) {
  const legacySlug =
    typeof searchParams.project === "string" ? searchParams.project : "";
  const legacyProject = findProject(legacySlug);
  if (legacyProject) {
    const query = typeof searchParams.q === "string" ? searchParams.q : "";
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (searchParams.view === "design") params.set("view", "design");
    permanentRedirect(
      projectPath(legacyProject) + (params.size ? `?${params}` : "")
    );
  }
  const repoInfoBySlug = await getAllRepoInfo(PROJECTS);

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="PROJECTS" title="一些專案們" />
      <Suspense fallback={null}>
        <ProjectFilterGrid items={PROJECTS} repoInfoBySlug={repoInfoBySlug} />
      </Suspense>
    </section>
  );
}
