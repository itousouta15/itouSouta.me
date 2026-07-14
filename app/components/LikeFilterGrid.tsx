"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Like } from "../data";
import { sortLikesByRating } from "../lib/sortLikes";
import { useVtuberLiveStatus } from "../hooks/useVtuberLiveStatus";
import LikeCard from "./LikeCard";
import LikeModalShell from "./LikeModalShell";

export default function LikeFilterGrid({
  items,
  layout,
}: {
  items: Like[];
  layout?: "circle" | "square";
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedLike, setSelectedLike] = useState<Like | null>(null);
  const useModal = layout !== "circle";
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  // circle layout 目前只有 vtuber 分類在用，開台偵測跟著這個條件掛載即可
  const liveMap = useVtuberLiveStatus(layout === "circle");

  // ?like=<index>（例如從全站搜尋導過來）時自動打開對應 modal
  useEffect(() => {
    const idx = searchParams.get("like");
    if (idx == null) return;
    const item = items[Number(idx)];
    if (item) setSelectedLike(item);
  }, [searchParams, items]);

  const closeModal = () => {
    setSelectedLike(null);
    if (searchParams.get("like")) router.replace(pathname, { scroll: false });
  };

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach(l => l.tags?.forEach(t => set.add(t)));
    return Array.from(set);
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = items.filter(l => {
      if (activeTag && !l.tags?.includes(activeTag)) return false;
      if (q && !l.title.toLowerCase().includes(q) && !l.sub?.toLowerCase().includes(q)) return false;
      return true;
    });
    return sortLikesByRating(result, "desc");
  }, [items, query, activeTag]);

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
      </div>
      {filtered.length > 0 ? (
        <div className={`likes-grid ${layout === "circle" ? "likes-grid--circle" : ""}`}>
          {filtered.map((l, i) => (
            <LikeCard
              l={l}
              layout={layout}
              key={`${l.title}-${i}`}
              onClick={useModal ? () => setSelectedLike(l) : undefined}
              live={l.href ? liveMap[l.href] : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="likes-empty">沒有符合條件的項目</div>
      )}
      {useModal && selectedLike && <LikeModalShell like={selectedLike} onClose={closeModal} />}
    </>
  );
}
