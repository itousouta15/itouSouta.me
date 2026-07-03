"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { LikeCategory, Like } from "../data";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import { sortLikesByRating } from "../lib/sortLikes";
import LikeCard from "./LikeCard";
import LikeModalShell from "./LikeModalShell";

const INITIAL_COUNT = 14;
const BATCH_SIZE = 14;

export default function LikeCategorySection({ cat }: { cat: LikeCategory }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [selectedLike, setSelectedLike] = useState<Like | null>(null);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [cat.key]);

  const sortedItems = useMemo(() => sortLikesByRating(cat.items, "desc"), [cat.items]);

  useEffect(() => {
    const track = trackRef.current;
    const sentinel = sentinelRef.current;
    if (!track || !sentinel) return;

    // Observed against the horizontally-scrolling track itself (not the
    // viewport): the default root only tracks vertical page scroll, so it
    // never fires while the user scrolls sideways within this row.
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount(c => Math.min(c + BATCH_SIZE, sortedItems.length));
        }
      },
      { root: track, rootMargin: "0px 600px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sortedItems.length]);

  const preview = sortedItems.slice(0, visibleCount);
  const useModal = cat.layout !== "circle";

  return (
    <div className="like-category">
      <div className="like-cat-head">
        <div className="like-cat-head-text">
          <span className="like-cat-en">{cat.en}</span>
          <h2 className="like-cat-title">{cat.label}</h2>
        </div>
        <Link className="like-expand-btn" href={`/likes/${cat.key}`}>
          查看更多 →
        </Link>
      </div>
      <div className="likes-track" ref={trackRef} data-lenis-prevent-wheel>
        {preview.map((l, i) => (
          <LikeCard
            l={l}
            carousel
            layout={cat.layout}
            key={`${cat.key}-${i}`}
            onClick={useModal ? () => setSelectedLike(l) : undefined}
          />
        ))}
        {visibleCount < sortedItems.length && <div ref={sentinelRef} className="likes-track-sentinel" aria-hidden />}
      </div>
      {useModal && selectedLike && <LikeModalShell like={selectedLike} onClose={() => setSelectedLike(null)} />}
    </div>
  );
}
