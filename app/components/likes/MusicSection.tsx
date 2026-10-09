"use client";

import { useRef } from "react";
import Link from "next/link";
import type { MusicSnapshot } from "../../lib/music";
import { useHorizontalWheelScroll } from "../../hooks/useHorizontalWheelScroll";
import MusicCard from "./MusicCard";
import MusicRecordingNote from "./MusicRecordingNote";

export default function MusicSection({ tracks, recording }: MusicSnapshot) {
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
      <MusicRecordingNote recording={recording} />
      <div className="music-artist-row" ref={rowRef} data-lenis-prevent-wheel>
        {tracks.map((track, index) => (
          <MusicCard
            track={track}
            carousel
            priority={index < 2}
            key={track.id}
          />
        ))}
      </div>
    </div>
  );
}
