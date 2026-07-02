"use client";

import { useRef } from "react";
import Link from "next/link";
import { LikeCategory } from "../data";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import LikeCard from "./LikeCard";

export default function LikeCategorySection({ cat }: { cat: LikeCategory }) {
  const trackRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(trackRef);

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
        {cat.items.map((l, i) => (
          <LikeCard l={l} carousel layout={cat.layout} key={`${cat.key}-${i}`} />
        ))}
      </div>
    </div>
  );
}
