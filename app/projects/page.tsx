import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { PROJECTS } from "../data";

export const metadata: Metadata = { title: "一些專案們 | itouSouta.tw" };

export default function ProjectsPage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="PROJECTS" title="一些專案們" />
      <div className="proj-grid">
        {PROJECTS.map(p => (
          <div className="proj-card" key={p.title}>
            <div className="proj-top">
              <div className={`proj-kicker ${p.color}`}>{p.kicker}</div>
              <span className="proj-arrow">↗</span>
            </div>
            <div className="proj-title">{p.title}</div>
            <div className="proj-desc">{p.desc}</div>
            <div className="proj-tags">
              {p.tags.map(t => (
                <span className="proj-tag" key={t}>{t}</span>
              ))}
            </div>
          </div>
        ))}
        <div className="proj-empty">
          <div className="proj-empty-plus">+</div>
          <div className="proj-empty-text">更多專案 coming soon</div>
        </div>
      </div>
    </section>
  );
}
