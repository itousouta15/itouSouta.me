import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import TileIcon from "../components/TileIcon";
import { PROJECTS } from "../data";

export const metadata: Metadata = { title: "一些專案們 | itousouta15.tw" };

export default function ProjectsPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="PROJECTS" title="一些專案們" />
      <div className="proj-grid">
        {PROJECTS.map(p => (
          <a className="proj-card" key={p.title} href={p.href} target="_blank" rel="noopener noreferrer">
            <div className="proj-top">
              <div className="proj-top-left">
                <div className="proj-icon">
                  <TileIcon kind={p.icon} />
                </div>
                <div className={`proj-kicker ${p.color}`}>{p.kicker}</div>
              </div>
              <span className="proj-arrow">↗</span>
            </div>
            <img className="proj-cover" src={p.cover} alt={`${p.title} 預覽圖`} loading="lazy" />
            <div className="proj-title">{p.title}</div>
            <div className="proj-desc">{p.desc}</div>
            <div className="proj-tags">
              {p.tags.map(t => (
                <span className="proj-tag" key={t}>{t}</span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
