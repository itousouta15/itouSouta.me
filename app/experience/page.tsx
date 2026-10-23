import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import ExperienceTimeline from "../components/experience/ExperienceTimeline";
import { EXPERIENCE, ExperienceItem } from "../data";
import { pageMetadata } from "../lib/seo";
import { site } from "../template/config";

const description = `${site.author.name} 的學習、工作與活動經歷。`;

export const metadata: Metadata = pageMetadata({
  title: "經歷",
  description,
  path: "/experience",
});

function groupByCategory(items: ExperienceItem[]) {
  const groups = new Map<string, ExperienceItem[]>();
  for (const e of items) {
    const key = e.category ?? "";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(e);
  }
  return [...groups.entries()];
}

export default function ExperiencePage() {
  const groups = groupByCategory(EXPERIENCE);

  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="JOURNEY" title="經歷" desc="走過的路，都是故事。" />
      <ExperienceTimeline groups={groups} />
    </section>
  );
}
