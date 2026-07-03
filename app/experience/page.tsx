import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { EXPERIENCE, ExperienceItem } from "../data";

const description = "郭家睿 / 伊藤蒼太的學習與活動經歷，包含校內資訊校隊、SCAICT 中電會等歷程。";

export const metadata: Metadata = {
  title: "經歷",
  description,
  alternates: { canonical: "/experience" },
  openGraph: { title: "經歷 | itouSouta15.tw", description, url: "/experience" },
  twitter: { title: "經歷 | itouSouta15.tw", description },
};

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
      <PageHead kicker="JOURNEY" title="經歷" desc="持續追求自身所愛" />
      {groups.map(([category, items]) => (
        <div className="timeline-group" key={category || "default"}>
          {category && <div className="timeline-group-head">{category}</div>}
          <div className="exp-timeline">
            {items.map((e, i) => (
              <div className="exp-row" key={i}>
                <div className="exp-node-col">
                  <span className={`exp-dot ${e.color ?? "blue"}`} />
                </div>
                <div className={`tl-card ${e.color ?? "blue"}`}>
                  <div className="tl-period">{e.period}</div>
                  <div className="tl-title">{e.title}</div>
                  {e.org && <div className="tl-org">{e.org}</div>}
                  {e.desc && <div className="tl-desc">{e.desc}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
