import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import TileIcon from "../components/TileIcon";
import { PROJECTS } from "../data";
import { projectCoverThumb } from "../lib/imageThumb";

const description = "郭家睿 / 伊藤蒼太製作的一些程式專案、網站與作品集展示。";

export const metadata: Metadata = {
  title: "一些專案們",
  description,
  alternates: { canonical: "/projects" },
  openGraph: { title: "一些專案們 | itouSouta15.tw", description, url: "/projects" },
  twitter: { title: "一些專案們 | itouSouta15.tw", description },
};

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
            <img
              className="proj-cover"
              src={projectCoverThumb(p.cover)}
              alt={`${p.title} 預覽圖`}
              loading="lazy"
              decoding="async"
            />
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
