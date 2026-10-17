import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { PROJECTS } from "../../data/projects";
import { findProject, projectPath } from "../../lib/projectRoutes";
import { pageMetadata } from "../../lib/seo";
import ProjectDetailBody from "../../components/projects/ProjectDetailBody";
import ProjectBackLink from "../../components/projects/ProjectBackLink";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = findProject(params.slug);
  if (!project) notFound();
  return pageMetadata({
    title: project.title,
    description: project.desc,
    path: projectPath(project),
  });
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = findProject(params.slug);
  if (!project) notFound();
  if (params.slug !== project.slug) permanentRedirect(projectPath(project));

  return (
    <article className="project-detail-page">
      <Suspense
        fallback={
          <Link href="/projects" className="project-back-link">
            ← 返回專案列表
          </Link>
        }
      >
        <ProjectBackLink />
      </Suspense>
      <header className="project-detail-heading">
        <h1 className="page-title">{project.title}</h1>
        <p>{project.desc}</p>
      </header>
      <ProjectDetailBody project={project} />
    </article>
  );
}
