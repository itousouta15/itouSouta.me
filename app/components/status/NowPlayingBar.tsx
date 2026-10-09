"use client";

import { usePathname } from "next/navigation";
import { discordArtThumb } from "../../lib/imageThumb";
import { useNowPlayingState } from "./LanyardCards";
import CrossfadeImage from "./CrossfadeImage";
import SpotifyProgress from "./SpotifyProgress";

/* 全站底部浮動膠囊：目前正在聽的 Spotify 曲目。資料跟首頁 profile 卡共用
   NowPlayingProvider 的同一份輪詢（provider 在 root layout），這裡只消費。
   首頁不顯示：profile 卡自己已經有一份一樣的正在聽資訊，兩個疊在一起會重複。 */
export default function NowPlayingBar() {
  const pathname = usePathname();
  // 首頁整個播放膠囊不掛載，連 context 更新與進度計時器都省掉。
  return pathname === "/" ? null : <NowPlayingContent />;
}

function NowPlayingContent() {
  const npState = useNowPlayingState();

  const track = npState.kind === "playing" ? npState.track : null;
  if (!track) return null;

  const href = track.href;

  const body = (
    <>
      <div className="now-playing-track">
        <CrossfadeImage
          className={`now-playing-art${track.isPlaying ? "" : " is-paused"}`}
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
      </div>
      {track.durationMs > 0 && (
        <SpotifyProgress track={track} className="now-playing-progress" />
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
