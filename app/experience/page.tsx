import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import ExperienceTimeline from "../components/experience/ExperienceTimeline";
import { EXPERIENCE, ExperienceItem } from "../data";
import { pageMetadata } from "../lib/seo";

const description =
  "itouSouta（伊藤蒼太 / 郭家睿）的學習與活動經歷：臺中市立大里高中資訊校隊、SCAICT 中電會、各種營隊與競賽的時間軸。";

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
      <PageHead kicker="JOURNEY" title="沒有路!!!" desc="持續追求自身所愛" />
      <ExperienceTimeline groups={groups} />
    </section>
  );
}
