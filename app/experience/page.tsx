import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { EXPERIENCE, ExperienceItem } from "../data";

export const metadata: Metadata = { title: "經歷 | itousouta15.tw" };

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
          <div className="timeline-grid">
            {items.map((e, i) => (
              <div className="tl-card-wrap" key={i}>
                <div className="tl-year-ghost" aria-hidden="true">{e.period}</div>
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
