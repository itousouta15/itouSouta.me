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
  const metadata = pageMetadata({
    title: project.title,
    description: project.desc,
    path: projectPath(project),
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      images: [{ url: project.cover, alt: `${project.title} 專案封面` }],
    },
    twitter: {
      ...metadata.twitter,
      images: [project.cover],
    },
  };
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = findProject(params.slug);
  if (!project) notFound();
  if (params.slug !== project.slug) permanentRedirect(projectPath(project));

  return (
    <article className="project-detail-page">
      <Suspense
        fallback={
          <Link
            href="/projects"
            className="back-link"
            aria-label="返回上一頁"
            title="返回上一頁"
            style={{ textDecoration: "none" }}
          >
            <span className="back-btn">←</span>
            <span className="back-label">返回上一頁</span>
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
