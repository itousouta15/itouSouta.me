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

export default function ProjectFilterGrid({
  items,
  repoInfoBySlug,
}: {
  items: Project[];
  repoInfoBySlug: Record<string, GithubRepoInfo | null>;
}) {
  const searchParams = useSearchParams();
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

  const search = (value: string) => {
    // Next's native History API integration updates useSearchParams without
    // refetching the server page on every keystroke. Back restores the query.
    window.history.replaceState(null, "", projectSearchPath(value));
  };

  return (
    <>
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
          {query.trim()
            ? `${filtered.length} / ${items.length} 個專案`
            : `${items.length} 個專案`}
        </span>
      </div>
      {filtered.length ? (
        <div className="proj-grid">
          {filtered.map((p) => {
            const stars = repoInfoBySlug[p.slug]?.stars;
            const href =
              projectPath(p) +
              (query ? `?${new URLSearchParams({ q: query })}` : "");
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
    </>
  );
}
