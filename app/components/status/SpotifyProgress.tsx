"use client";

import { memo, useEffect, useState } from "react";
import type { NowPlayingTrack } from "./LanyardCards";

/* 只有進度條每秒更新，歌名、封面與其他活動卡不跟著重新 render。
   transform 補間不改盒子尺寸，播放時不會每幀觸發 Layout。 */
export default memo(function SpotifyProgress({
  track,
  className,
}: {
  track: NowPlayingTrack;
  className: string;
}) {
  const [now, setNow] = useState(() => Date.now());

  // 時鐘只跟播放／暫停走；輪詢校正進度不需要重建 interval。
  useEffect(() => {
    if (!track.isPlaying) return;
    let timer: ReturnType<typeof setInterval> | undefined;

    const sync = () => {
      clearInterval(timer);
      if (document.visibilityState !== "visible") return;
      setNow(Date.now());
      timer = setInterval(() => setNow(Date.now()), 1000);
    };

    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [track.isPlaying]);

  const elapsed = track.isPlaying ? Math.max(0, now - track.fetchedAt) : 0;
  const progress =
    track.durationMs > 0
      ? Math.min(
          1,
          Math.max(0, (track.progressMs + elapsed) / track.durationMs)
        )
      : 0;

  return (
    <div className={className} aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
});
