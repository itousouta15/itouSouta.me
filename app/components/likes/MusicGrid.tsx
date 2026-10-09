"use client";

import { useMemo, useState } from "react";
import type { MusicTrack } from "../../lib/music";
import MusicCard from "./MusicCard";

export default function MusicGrid({ tracks }: { tracks: MusicTrack[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "plays">("rank");
  const filtered = useMemo(() => {
    const text = query.trim().toLocaleLowerCase();
    const items = tracks.filter(
      (track) =>
        !text ||
        `${track.title} ${track.artist}`.toLocaleLowerCase().includes(text)
    );
    return items.sort((a, b) =>
      sort === "plays"
        ? (b.recordedPlays ?? -1) - (a.recordedPlays ?? -1) || a.rank - b.rank
        : a.rank - b.rank
    );
  }, [tracks, query, sort]);

  return (
    <>
      <div className="likes-toolbar music-toolbar">
        <label className="sr-only" htmlFor="music-search">
          搜尋歌曲或歌手
        </label>
        <input
          id="music-search"
          className="likes-search"
          type="search"
          placeholder="搜尋歌曲或歌手…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <label className="sr-only" htmlFor="music-sort">
          排序方式
        </label>
        <select
          id="music-sort"
          className="music-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value as "rank" | "plays")}
        >
          <option value="rank">Spotify 常聽排行</option>
          <option value="plays">已記錄次數</option>
        </select>
      </div>
      {filtered.length ? (
        <div className="likes-grid music-grid">
          {filtered.map((track, index) => (
            <MusicCard key={track.id} track={track} priority={index < 2} />
          ))}
        </div>
      ) : (
        <p className="likes-empty">
          {tracks.length ? "沒有符合條件的歌曲" : "目前無法取得常聽歌曲"}
        </p>
      )}
    </>
  );
}
