"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECTS, LIKE_CATEGORIES, LINKS, EXPERIENCE } from "../data";

interface SearchItem {
  id: string;
  title: string;
  sub?: string;
  href: string;
  external?: boolean;
  category: string;
  projectSlug?: string;
}

const STATIC_PAGES: SearchItem[] = [
  { id: "page-about", title: "關於我", href: "/about", category: "頁面" },
  { id: "page-projects", title: "一些專案們", href: "/projects", category: "頁面" },
  { id: "page-likes", title: "喜歡的東西", href: "/likes", category: "頁面" },
  { id: "page-links", title: "友鏈", href: "/links", category: "頁面" },
  { id: "page-experience", title: "經歷", href: "/experience", category: "頁面" },
  { id: "page-thoughts", title: "雜談", href: "/thoughts", category: "頁面" },
];

const PROJECT_ITEMS: SearchItem[] = PROJECTS.map(p => ({
  id: `project-${p.slug}`,
  title: p.title,
  sub: p.desc,
  href: p.href,
  category: "專案",
  projectSlug: p.slug,
}));

const LIKE_ITEMS: SearchItem[] = LIKE_CATEGORIES.flatMap(cat =>
  cat.items.map((item, i) => ({
    id: `like-${cat.key}-${i}`,
    title: item.title,
    sub: item.sub,
    href: item.href ?? `/likes/${cat.key}`,
    external: !!item.href,
    category: `收藏・${cat.label}`,
  }))
);

const LINK_ITEMS: SearchItem[] = LINKS.map((l, i) => ({
  id: `link-${i}`,
  title: l.name,
  sub: l.desc,
  href: l.href,
  external: true,
  category: "友鏈",
}));

const EXPERIENCE_ITEMS: SearchItem[] = EXPERIENCE.map((e, i) => ({
  id: `exp-${i}`,
  title: e.title,
  sub: e.org,
  href: "/experience",
  category: "經歷",
}));

const ALL_ITEMS: SearchItem[] = [...STATIC_PAGES, ...PROJECT_ITEMS, ...LIKE_ITEMS, ...LINK_ITEMS, ...EXPERIENCE_ITEMS];
const MAX_RESULTS = 40;

function groupResults(items: SearchItem[]) {
  const groups: { category: string; items: SearchItem[] }[] = [];
  const index = new Map<string, number>();
  for (const item of items) {
    let gi = index.get(item.category);
    if (gi === undefined) {
      gi = groups.length;
      index.set(item.category, gi);
      groups.push({ category: item.category, items: [] });
    }
    groups[gi].items.push(item);
  }
  return groups;
}

export default function CommandPaletteInner({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ALL_ITEMS.slice(0, MAX_RESULTS);
    return ALL_ITEMS.filter(
      item => item.title.toLowerCase().includes(q) || item.sub?.toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    ).slice(0, MAX_RESULTS);
  }, [query]);

  const groups = useMemo(() => groupResults(results), [results]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // 鍵盤上下移動時讓選中的項目保持在可視範圍內
  useEffect(() => {
    listRef.current
      ?.querySelector(".cmdk-item.active")
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const goTo = (item: SearchItem) => {
    onClose();
    if (item.projectSlug) {
      // 導到專案頁，由該頁讀 ?project= 觸發對應的 client-side modal
      router.push(`/projects?project=${encodeURIComponent(item.projectSlug)}`);
    } else if (item.external) {
      window.open(item.href, "_blank", "noopener,noreferrer");
    } else {
      router.push(item.href);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = results[activeIndex];
      if (item) goTo(item);
    }
  };

  return (
    <div className="cmdk-overlay" role="dialog" aria-modal="true" aria-label="全站搜尋">
      <button type="button" className="cmdk-close" onClick={onClose} aria-label="關閉搜尋">
        ✕
      </button>
      <div className="cmdk-panel">
        <input
          ref={inputRef}
          className="cmdk-input"
          type="text"
          placeholder="搜尋..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <div className="cmdk-hint">↑↓ 選擇 · ↵ 前往 · ESC 關閉</div>
        {/* data-lenis-prevent：Lenis 會攔截整頁滾輪事件，沒有這個屬性內層容器滾不動 */}
        <div className="cmdk-results" ref={listRef} data-lenis-prevent>
          {results.length === 0 && <div className="cmdk-empty">沒有符合的結果</div>}
          {groups.map(group => (
            <div className="cmdk-group" key={group.category}>
              <div className="cmdk-group-head">{group.category}</div>
              {group.items.map(item => {
                const flatIndex = results.indexOf(item);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`cmdk-item ${flatIndex === activeIndex ? "active" : ""}`}
                    onMouseEnter={() => setActiveIndex(flatIndex)}
                    onClick={() => goTo(item)}
                  >
                    <span className="cmdk-item-title">{item.title}</span>
                    {item.sub && <span className="cmdk-item-sub">{item.sub}</span>}
                    <span className="cmdk-item-arrow">{item.external ? "↗" : "→"}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
