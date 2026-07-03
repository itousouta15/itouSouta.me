"use client";

import { useMemo, useState } from "react";
import type { Like } from "../data";
import { sortLikesByRating } from "../lib/sortLikes";
import LikeCard from "./LikeCard";
import LikeModalShell from "./LikeModalShell";

export default function LikeFilterGrid({
  items,
  layout,
}: {
  items: Like[];
  layout?: "circle";
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [sortMode, setSortMode] = useState<"default" | "rating-desc" | "rating-asc">("rating-desc");
  const [selectedLike, setSelectedLike] = useState<Like | null>(null);
  const useModal = layout !== "circle";

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(l => l.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [items]);

  const hasRatings = useMemo(() => items.some(l => l.rating != null || l.personRating != null), [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = items.filter(l => {
      if (activeTag && !l.tags?.includes(activeTag)) return false;
      if (q && !l.title.toLowerCase().includes(q) && !l.sub?.toLowerCase().includes(q)) return false;
      return true;
    });
    if (sortMode === "default") return result;
    return sortLikesByRating(result, sortMode === "rating-desc" ? "desc" : "asc");
  }, [items, query, activeTag, sortMode]);

  return (
    <>
      <div className="likes-toolbar">
        <input
          className="likes-search"
          type="text"
          inputMode="search"
          placeholder="搜尋名稱..."
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
        {hasRatings && (
          <div className="likes-tag-row">
            <button
              type="button"
              className={`likes-tag-chip ${sortMode === "default" ? "active" : ""}`}
              onClick={() => setSortMode("default")}
            >
              預設排序
            </button>
            <button
              type="button"
              className={`likes-tag-chip ${sortMode === "rating-desc" ? "active" : ""}`}
              onClick={() => setSortMode("rating-desc")}
            >
              評分 高→低
            </button>
            <button
              type="button"
              className={`likes-tag-chip ${sortMode === "rating-asc" ? "active" : ""}`}
              onClick={() => setSortMode("rating-asc")}
            >
              評分 低→高
            </button>
          </div>
        )}
      </div>
      {filtered.length > 0 ? (
        <div className={`likes-grid ${layout === "circle" ? "likes-grid--circle" : ""}`}>
          {filtered.map((l, i) => (
            <LikeCard
              l={l}
              layout={layout}
              key={`${l.title}-${i}`}
              onClick={useModal ? () => setSelectedLike(l) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="likes-empty">沒有符合條件的項目</div>
      )}
      {useModal && selectedLike && <LikeModalShell like={selectedLike} onClose={() => setSelectedLike(null)} />}
    </>
  );
}
