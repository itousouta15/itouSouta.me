import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "../components/PageHead";
import ProjectFilterGrid from "../components/ProjectFilterGrid";
import { PROJECTS } from "../data";
import { getRepoInfo, parseGithubRepo, type GithubRepoInfo } from "../lib/github";

const description = "郭家睿 / 伊藤蒼太製作的一些程式專案、網站與作品集展示。";

export const metadata: Metadata = {
  title: "一些專案們",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "一些專案們 | itouSouta15.tw", description, url: "/projects" },
  twitter: { title: "一些專案們 | itouSouta15.tw", description },
};

export const revalidate = 3600;

export default async function ProjectsPage() {
  // GitHub 數據在 server 端一次抓齊傳給 client，開 modal 時零延遲
  const entries = await Promise.all(
    PROJECTS.map(async p => {
      const ref = parseGithubRepo(p.href);
      const info = ref ? await getRepoInfo(ref.owner, ref.repo).catch(() => null) : null;
      return [p.slug, info] as const;
    })
  );
  const repoInfoBySlug: Record<string, GithubRepoInfo | null> = Object.fromEntries(entries);

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="PROJECTS" title="一些專案們" />
      <Suspense fallback={null}>
        <ProjectFilterGrid items={PROJECTS} repoInfoBySlug={repoInfoBySlug} />
      </Suspense>
    </section>
  );
}
