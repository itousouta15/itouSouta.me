import type { Metadata } from "next";
import { Suspense } from "react";
import PageHead from "../components/PageHead";
import ProjectFilterGrid from "../components/ProjectFilterGrid";
import { PROJECTS } from "../data";
import { getAllRepoInfo } from "../lib/github";
import { pageMetadata } from "../lib/seo";

const description =
  "itouSouta 做過的專案們：個人網站、Discord bot、線上評測與各種小工具，每個都有介紹、用到的技術、開發歷程與 GitHub 原始碼 (◍•ᴗ•◍)ゝ";

export const metadata: Metadata = pageMetadata({
  title: "一些專案們",
  description,
  path: "/projects",
});

export const revalidate = 3600;

export default async function ProjectsPage() {
  // GitHub 數據在 server 端一次抓齊傳給 client，開 modal 時零延遲
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
