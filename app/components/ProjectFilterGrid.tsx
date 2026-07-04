"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Project } from "../data";
import type { GithubRepoInfo } from "../lib/github";
import TileIcon from "./TileIcon";
import ProjectModalShell from "./ProjectModalShell";
import ProjectDetailBody from "./ProjectDetailBody";
import { projectCoverThumb } from "../lib/imageThumb";

export default function ProjectFilterGrid({
  items,
  repoInfoBySlug,
}: {
  items: Project[];
  repoInfoBySlug: Record<string, GithubRepoInfo | null>;
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(p => p.tags.forEach(t => set.add(t)));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(p => {
      if (activeTag && !p.tags.includes(activeTag)) return false;
      if (q && !p.title.toLowerCase().includes(q) && !p.desc.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, query, activeTag]);

  // ?project=<slug>（例如從全站搜尋導過來）時自動打開對應 modal
  useEffect(() => {
    const slug = searchParams.get("project");
    if (!slug) return;
    const p = items.find(x => x.slug === slug);
    if (p) setActiveProject(p);
  }, [searchParams, items]);

  const closeModal = () => {
    setActiveProject(null);
    if (searchParams.get("project")) router.replace("/projects", { scroll: false });
  };

  return (
    <>
      <div className="likes-toolbar">
        <input
          className="likes-search"
          type="text"
          inputMode="search"
          placeholder="搜尋專案..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {tags.length > 0 && (
          <div className="likes-tag-row">
            <button
              type="button"
              className={`likes-tag-chip ${activeTag === null ? "active" : ""}`}
              onClick={() => setActiveTag(null)}
            >
              全部
            </button>
            {tags.map(t => (
              <button
                type="button"
                key={t}
                className={`likes-tag-chip ${activeTag === t ? "active" : ""}`}
                onClick={() => setActiveTag(cur => (cur === t ? null : t))}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>
      {filtered.length > 0 ? (
        <div className="proj-grid">
          {filtered.map(p => (
            // href 指向 GitHub：無 JS 或 Ctrl/中鍵點擊時直接開 repo，一般點擊則開 modal
            <a
              className="proj-card"
              key={p.slug}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={e => {
                if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                e.preventDefault();
                setActiveProject(p);
              }}
            >
              <div className="proj-top">
                <div className="proj-top-left">
                  <div className="proj-icon">
                    <TileIcon kind={p.icon} />
                  </div>
                  <div className={`proj-kicker ${p.color}`}>{p.kicker}</div>
                </div>
                <span className="proj-arrow">↗</span>
              </div>
              <div className="proj-cover-wrap">
                <img
                  className="proj-cover"
                  src={projectCoverThumb(p.cover)}
                  alt={`${p.title} 預覽圖`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
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
      ) : (
        <div className="likes-empty">沒有符合條件的專案</div>
      )}
      {activeProject && (
        <ProjectModalShell
          kicker={activeProject.kicker}
          kickerColor={activeProject.color}
          title={activeProject.title}
          desc={activeProject.desc}
          onClose={closeModal}
        >
          <ProjectDetailBody project={activeProject} repoInfo={repoInfoBySlug[activeProject.slug] ?? null} />
        </ProjectModalShell>
      )}
    </>
  );
}
