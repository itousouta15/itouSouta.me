import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { EXPERIENCE } from "../data";

export const metadata: Metadata = { title: "經歷 | itouSouta.tw" };

export default function ExperiencePage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="JOURNEY" title="經歷" />
      <div className="timeline">
        {EXPERIENCE.map((e, i) => (
          <div className="tl-item" key={i}>
            <span className={`tl-node ${e.color ?? "blue"}`} />
            <div className="tl-period">{e.period}</div>
            <div className="tl-card">
              <div className="tl-title">{e.title}</div>
              {e.org && <div className="tl-org">{e.org}</div>}
              {e.desc && <div className="tl-desc">{e.desc}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
