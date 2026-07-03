import type { Project } from "../data";
import type { GithubRepoInfo } from "../lib/github";
import { projectCoverThumb } from "../lib/imageThumb";

export default function ProjectDetailBody({
  project,
  repoInfo,
}: {
  project: Project;
  repoInfo: GithubRepoInfo | null;
}) {
  return (
    <>
      <img
        className="proj-detail-cover"
        src={projectCoverThumb(project.cover)}
        alt={`${project.title} 預覽圖`}
        loading="lazy"
        decoding="async"
      />

      <div className="proj-tags" style={{ marginTop: 16 }}>
        {project.tags.map(t => (
          <span className="proj-tag" key={t}>{t}</span>
        ))}
      </div>

      <div className="proj-detail-actions">
        <a className="btn-primary" href={project.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
          GitHub <span className="btn-arrow dark">→</span>
        </a>
        {project.siteUrl && (
          <a className="btn-ghost" href={project.siteUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            網站 <span className="btn-arrow inset">→</span>
          </a>
        )}
        {project.demoUrl && (
          <a className="btn-ghost" href={project.demoUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            Demo <span className="btn-arrow inset">→</span>
          </a>
        )}
      </div>

      {repoInfo && (
        <div className="stat-grid" style={{ marginTop: 24 }}>
          <div className="stat">
            <div className="stat-k">STARS</div>
            <div className="stat-v mono">{repoInfo.stars}</div>
          </div>
          {repoInfo.language && (
            <div className="stat">
              <div className="stat-k">LANGUAGE</div>
              <div className="stat-v sans">{repoInfo.language}</div>
            </div>
          )}
          <div className="stat">
            <div className="stat-k">LAST PUSH</div>
            <div className="stat-v sans">{new Date(repoInfo.pushedAt).toLocaleDateString("zh-TW")}</div>
          </div>
        </div>
      )}

      {project.why && (
        <div className="proj-detail-section">
          <div className="card-kicker">為什麼做</div>
          <p className="about-p">{project.why}</p>
        </div>
      )}

      {project.longDesc && (
        <div className="proj-detail-section">
          <div className="card-kicker">專案介紹</div>
          <p className="about-p">{project.longDesc}</p>
        </div>
      )}

      {project.difficulties && (
        <div className="proj-detail-section">
          <div className="card-kicker">遇到的困難</div>
          <p className="about-p">{project.difficulties}</p>
        </div>
      )}

      {project.timeline && project.timeline.length > 0 && (
        <div className="proj-detail-section">
          <div className="card-kicker">TIMELINE</div>
          <div className="timeline-grid">
            {project.timeline.map((t, i) => (
              <div className="tl-card-wrap" key={i}>
                <div className="tl-year-ghost" aria-hidden="true">{t.version}</div>
                <div className={`tl-card ${project.color}`}>
                  <div className="tl-period">{t.date}</div>
                  <div className="tl-title">{t.version}</div>
                  {t.note && <div className="tl-desc">{t.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
