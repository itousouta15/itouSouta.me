"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Project } from "../../data";
import type { GithubRepoInfo } from "../../lib/github";
import {
  matchesProject,
  projectPath,
  projectSearchPath,
} from "../../lib/projectRoutes";
import { projectCoverThumb } from "../../lib/imageThumb";

function ProjectCards({
  projects,
  query,
  view,
  repoInfoBySlug,
}: {
  projects: Project[];
  query: string;
  view?: "design";
  repoInfoBySlug: Record<string, GithubRepoInfo | null>;
}) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (view) params.set("view", view);
  return (
    <div className="proj-grid">
      {projects.map((p) => {
        const stars = repoInfoBySlug[p.slug]?.stars;
        const href = projectPath(p) + (params.size ? `?${params}` : "");
        return (
          <Link className="proj-card" key={p.slug} href={href}>
            <div className="proj-cover-wrap">
              <img
                className="proj-cover"
                src={projectCoverThumb(p.cover)}
                alt={`${p.title} 預覽圖`}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="project-card-heading">
              <h2 className="proj-title">{p.title}</h2>
              <span className="proj-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <p className="proj-desc">{p.desc}</p>
            {stars != null && stars > 0 && (
              <span
                className="proj-stars"
                aria-label={`${stars} 顆 GitHub 星星`}
              >
                <span aria-hidden="true">★</span>
                {stars}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default function ProjectFilterGrid({
  items,
  repoInfoBySlug,
}: {
  items: Project[];
  repoInfoBySlug: Record<string, GithubRepoInfo | null>;
}) {
  const searchParams = useSearchParams();
  const designView = searchParams.get("view") === "design";
  const query = searchParams.get("q") ?? "";
  const filtered = useMemo(
    () =>
      items
        .filter((p) => matchesProject(p, query))
        .sort((a, b) => {
          const sa = repoInfoBySlug[a.slug]?.stars;
          const sb = repoInfoBySlug[b.slug]?.stars;
          if (sa == null && sb == null) return 0;
          if (sa == null) return 1;
          if (sb == null) return -1;
          return sb - sa;
        }),
    [items, query, repoInfoBySlug]
  );
  const inCategory = (p: Project, category: "development" | "design") =>
    Array.isArray(p.category)
      ? p.category.includes(category)
      : p.category === category;
  const development = filtered.filter((p) => inCategory(p, "development"));
  const designProjects = filtered.filter((p) => inCategory(p, "design"));
  const developmentCount = items.filter((p) =>
    inCategory(p, "development")
  ).length;
  const designCount = items.filter((p) => inCategory(p, "design")).length;

  const search = (value: string) => {
    // Next's native History API integration updates useSearchParams without
    // refetching the server page on every keystroke. Back restores the query.
    window.history.replaceState(
      null,
      "",
      projectSearchPath(value, designView ? "design" : undefined)
    );
  };

  const changeView = (view?: "design") => {
    window.history.replaceState(null, "", projectSearchPath(query, view));
  };

  return (
    <>
      <div className="project-tabs" role="tablist" aria-label="專案分類">
        <button
          type="button"
          role="tab"
          id="project-development-tab"
          aria-selected={!designView}
          aria-controls="project-development-panel"
          tabIndex={designView ? -1 : 0}
          onClick={() => changeView()}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              changeView("design");
              document.getElementById("project-design-tab")?.focus();
            }
          }}
        >
          開發 <span>{developmentCount}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="project-design-tab"
          aria-selected={designView}
          aria-controls="project-design-panel"
          tabIndex={designView ? 0 : -1}
          onClick={() => changeView("design")}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              changeView();
              document.getElementById("project-development-tab")?.focus();
            }
          }}
        >
          設計 <span>{designCount}</span>
        </button>
      </div>
      <div className="project-toolbar">
        <div className="project-search-wrap">
          <label htmlFor="project-search" className="sr-only">
            搜尋專案名稱、介紹或技術
          </label>
          <input
            id="project-search"
            className="likes-search"
            type="search"
            placeholder="搜尋名稱、介紹或技術…"
            value={query}
            onChange={(e) => search(e.target.value)}
          />
          {query && (
            <button
              type="button"
              className="project-search-clear"
              onClick={() => search("")}
              aria-label="清除搜尋"
            >
              ✕
            </button>
          )}
        </div>
        <span className="project-result-count" role="status">
          {designView
            ? query.trim()
              ? `${designProjects.length} / ${designCount} 個專案`
              : `${designCount} 個專案`
            : query.trim()
              ? `${development.length} / ${developmentCount} 個專案`
              : `${developmentCount} 個專案`}
        </span>
      </div>
      <div
        id="project-development-panel"
        role="tabpanel"
        aria-labelledby="project-development-tab"
        hidden={designView}
      >
        {development.length ? (
          <ProjectCards
            projects={development}
            query={query}
            repoInfoBySlug={repoInfoBySlug}
          />
        ) : (
          <div className="likes-empty">
            <p>沒有符合「{query}」的專案</p>
            <button
              className="btn-ghost"
              type="button"
              onClick={() => search("")}
            >
              清除搜尋
            </button>
          </div>
        )}
      </div>
      <div
        id="project-design-panel"
        role="tabpanel"
        aria-labelledby="project-design-tab"
        hidden={!designView}
      >
        {designProjects.length ? (
          <ProjectCards
            projects={designProjects}
            query={query}
            view="design"
            repoInfoBySlug={repoInfoBySlug}
          />
        ) : (
          <div className="likes-empty">
            <p>沒有符合「{query}」的專案</p>
            <button
              className="btn-ghost"
              type="button"
              onClick={() => search("")}
            >
              清除搜尋
            </button>
          </div>
        )}
      </div>
    </>
  );
}
