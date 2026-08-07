"use client";

import { useEffect, useState } from "react";
import { discordArtThumb } from "../lib/imageThumb";
import { useLanyardState } from "./LanyardCards";

/* 全站底部浮動膠囊：Discord 正在聽的 Spotify 曲目。資料跟首頁 profile 卡共用
   LanyardProvider 的同一份 15 秒輪詢（provider 在 root layout），這裡只消費。 */
export default function NowPlayingBar() {
  const state = useLanyardState();
  const [now, setNow] = useState(() => Date.now());

  const ready = state.kind === "ready" ? state.data : null;
  const spotify = ready && ready.listening_to_spotify ? ready.spotify : null;

  useEffect(() => {
    if (!spotify?.timestamps) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
    // 只跟著曲目的起訖時間走，同 ProfileStatus 的理由
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotify?.timestamps?.start, spotify?.timestamps?.end]);

  if (!spotify) return null;

  let progress = 0;
  if (spotify.timestamps) {
    const { start, end } = spotify.timestamps;
    progress = Math.min(1, Math.max(0, (now - start) / (end - start)));
  }

  const href = spotify.track_id
    ? `https://open.spotify.com/track/${spotify.track_id}`
    : null;

  const body = (
    <>
      <img
        className="now-playing-art"
        src={discordArtThumb(spotify.album_art_url)}
        alt=""
      />
      <div className="now-playing-meta">
        <div className="now-playing-song" title={spotify.song}>
          {spotify.song}
        </div>
        <div className="now-playing-artist" title={spotify.artist}>
          {spotify.artist}
        </div>
      </div>
      {spotify.timestamps && (
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
      aria-label={`正在聽 Spotify：${spotify.song} - ${spotify.artist}`}
    >
      {body}
    </a>
  ) : (
    <div className="now-playing" aria-label={`正在聽 Spotify：${spotify.song}`}>
      {body}
    </div>
  );
}
