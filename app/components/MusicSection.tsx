"use client";

import { useRef } from "react";
import Link from "next/link";
import type { TopAlbum } from "../lib/lastfm";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import LikeCard from "./LikeCard";

export default function MusicSection({ albums }: { albums: TopAlbum[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  useHorizontalWheelScroll(rowRef);

  return (
    <div className="like-category">
      <div className="like-cat-head">
        <div className="like-cat-head-text">
          <span className="like-cat-en">MUSIC</span>
          <h2 className="like-cat-title">音樂</h2>
        </div>
        <Link className="like-expand-btn" href="/likes/music">
          查看更多 →
        </Link>
      </div>
      <div className="music-artist-row" ref={rowRef} data-lenis-prevent-wheel>
        {albums.map((a, i) => (
          <LikeCard l={{ title: a.title, sub: a.artist, cover: a.cover, href: a.href }} carousel layout="square" key={`${a.title}-${i}`} />
        ))}
      </div>
    </div>
  );
}
