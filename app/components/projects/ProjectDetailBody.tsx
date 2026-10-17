import type { Project } from "../../data";
import { sourceHostLabel } from "../../lib/repoHost";
import { getProjectScreenshots } from "../../lib/projectGallery";
import ProjectGallery from "./ProjectGallery";
import ProjectMarkdown from "./ProjectMarkdown";

export default function ProjectDetailBody({ project }: { project: Project }) {
  return (
    <>
      <ProjectGallery
        title={project.title}
        images={getProjectScreenshots(project)}
      />
      <div className="project-detail-layout">
        <div className="project-detail-story">
          {project.content?.trim() ? (
            <ProjectMarkdown content={project.content} />
          ) : (
            <section className="project-story-section">
              <h2>專案介紹</h2>
              <p className="about-p">{project.desc}</p>
            </section>
          )}
        </div>
        <aside className="project-detail-sidebar" aria-label="專案技術與連結">
          <h2>使用技術</h2>
          <div className="proj-tags">
            {project.tags.map((tag) => (
              <span className="proj-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <div className="proj-detail-actions">
            <a
              className="btn-primary"
              href={project.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {sourceHostLabel(project.href)}
              <span className="btn-arrow dark" aria-hidden="true">
                →
              </span>
            </a>
            {project.siteUrl && (
              <a
                className="btn-ghost"
                href={project.siteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                網站
                <span className="btn-arrow inset" aria-hidden="true">
                  →
                </span>
              </a>
            )}
            {project.demoUrl && (
              <a
                className="btn-ghost"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Demo
                <span className="btn-arrow inset" aria-hidden="true">
                  →
                </span>
              </a>
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
