"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { LikeCategory } from "../data";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import LikeCard from "./LikeCard";

const INITIAL_COUNT = 14;
const BATCH_SIZE = 14;

export default function LikeCategorySection({ cat }: { cat: LikeCategory }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [cat.key]);

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
          setVisibleCount(c => Math.min(c + BATCH_SIZE, cat.items.length));
        }
      },
      { root: track, rootMargin: "0px 600px 0px 0px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [cat.items.length]);

  const preview = cat.items.slice(0, visibleCount);

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
          <LikeCard l={l} carousel layout={cat.layout} key={`${cat.key}-${i}`} />
        ))}
        {visibleCount < cat.items.length && <div ref={sentinelRef} className="likes-track-sentinel" aria-hidden />}
      </div>
    </div>
  );
}
