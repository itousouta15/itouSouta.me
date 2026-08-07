import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHead from "../../components/PageHead";
import ProjectDetailBody from "../../components/ProjectDetailBody";
import { PROJECTS } from "../../data";
import { getRepoInfo, parseGithubRepo } from "../../lib/github";

/* 專案詳情的獨立頁。/projects 上的 modal 仍然保留（同一頁瀏覽比較順），但 modal 是
   client 端狀態渲染的，why / longDesc / difficulties / timeline 這些內容永遠進不了
   server HTML——搜尋引擎看不到，也沒辦法把單一專案的連結分享出去。這頁把同一個
   ProjectDetailBody 原封不動搬到 server 端，兩邊共用，不需要任何新 CSS。 */

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) return { title: "找不到專案" };

  const url = `/projects/${project.slug}`;
  const description = project.longDesc ?? project.desc;
  return {
    title: project.title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${project.title} | itousouta.me`,
      description,
      url,
    },
    twitter: { title: `${project.title} | itousouta.me`, description },
  };
}

export const revalidate = 3600;

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = PROJECTS.find((p) => p.slug === params.slug);
  if (!project) notFound();

  const ref = parseGithubRepo(project.href);
  const repoInfo = ref
    ? await getRepoInfo(ref.owner, ref.repo).catch(() => null)
    : null;

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead
        kicker={project.kicker}
        title={project.title}
        desc={project.desc}
        back="/projects"
      />
      <ProjectDetailBody project={project} repoInfo={repoInfo} />
    </section>
  );
}
