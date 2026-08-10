"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { discordArtThumb } from "../lib/imageThumb";
import { useNowPlayingState } from "./LanyardCards";

/* 全站底部浮動膠囊：目前正在聽的 Spotify 曲目。資料跟首頁 profile 卡共用
   NowPlayingProvider 的同一份輪詢（provider 在 root layout），這裡只消費。
   首頁不顯示：profile 卡自己已經有一份一樣的正在聽資訊，兩個疊在一起會重複。 */
export default function NowPlayingBar() {
  const pathname = usePathname();
  const npState = useNowPlayingState();
  const [now, setNow] = useState(() => Date.now());

  const track = npState.kind === "playing" ? npState.track : null;

  useEffect(() => {
    if (!track?.isPlaying) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
    // 只跟著曲目本身走，同 ProfileStatus 的理由
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track?.isPlaying, track?.song, track?.artist]);

  if (!track || pathname === "/") return null;

  let progress = 0;
  if (track.durationMs > 0) {
    const elapsedSinceFetch = track.isPlaying ? now - track.fetchedAt : 0;
    progress = Math.min(
      1,
      Math.max(0, (track.progressMs + elapsedSinceFetch) / track.durationMs)
    );
  }

  const href = track.href;

  const body = (
    <>
      <img
        className="now-playing-art"
        src={discordArtThumb(track.albumArt)}
        alt=""
      />
      <div className="now-playing-meta">
        <div className="now-playing-song" title={track.song}>
          {track.song}
        </div>
        <div className="now-playing-artist" title={track.artist}>
          {track.artist}
        </div>
      </div>
      {track.durationMs > 0 && (
        <div className="now-playing-progress">
          <span style={{ width: `${progress * 100}%` }} />
        </div>
      )}
    </>
  );

  return href ? (
    <a
      className="now-playing"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`正在聽 Spotify：${track.song} - ${track.artist}`}
    >
      {body}
    </a>
  ) : (
    <div className="now-playing" aria-label={`正在聽 Spotify：${track.song}`}>
      {body}
    </div>
  );
}
