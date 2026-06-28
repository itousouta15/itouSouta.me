"use client";

import { useRef } from "react";
import Link from "next/link";
import { MUSIC_ARTISTS } from "../data";
import { useHorizontalWheelScroll } from "../hooks/useHorizontalWheelScroll";
import MusicArtistCard from "./MusicArtistCard";

export default function MusicSection() {
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
      <div className="music-artist-row" ref={rowRef}>
        {MUSIC_ARTISTS.map((artist, index) => (
          <MusicArtistCard artist={artist} index={index} key={artist.name} />
        ))}
      </div>
    </div>
  );
}
