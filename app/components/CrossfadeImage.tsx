"use client";

import { useEffect, useRef, useState } from "react";

/* 淡入淡出換圖：疊兩張圖，新圖淡入蓋掉舊圖，過渡完就把舊圖從 DOM 移除。用在
   專輯封面隨曲目切換時，讓畫面看起來是連續的漸變，而不是瞬間跳成新圖。
   className 吃呼叫端原本掛在 <img> 上的尺寸/圓角 class（如 now-playing-art），
   這裡改套在外層 wrapper 上，兩張疊圖再各自撐滿並繼承圓角。 */
export default function CrossfadeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  const [current, setCurrent] = useState(src);
  const [previous, setPrevious] = useState<string | null>(null);
  // 畫面上「當下顯示的那張」，跟 current state 同步。用 ref 是因為預載回來時
  // 才需要知道要把誰推去當底圖，而那時 effect 的 closure 早就跑完了。
  const currentRef = useRef(src);

  useEffect(() => {
    if (src === currentRef.current) return;

    let done = false;
    let removeTimer: ReturnType<typeof setTimeout> | undefined;
    const swap = () => {
      if (done) return;
      done = true;
      setPrevious(currentRef.current);
      setCurrent(src);
      currentRef.current = src;
      // 400ms 要跟 CSS 的 crossfade-img-in 動畫時長對齊，動畫播完才把舊圖拿掉
      removeTimer = setTimeout(() => setPrevious(null), 400);
    };

    /* 先把新封面載完再開始換：直接換的話，新 <img> 這時才開始抓圖，淡入的是一張
       還沒解碼的空圖，舊圖一撤就變成硬跳——等於沒有漸變。預載期間畫面停在舊封面。*/
    const pre = new Image();
    pre.onload = swap;
    // 載失敗也要換，不然會永遠卡在上一首的封面
    pre.onerror = swap;
    pre.src = src;
    // 已在快取的圖 onload 可能不會再觸發，補一次同步檢查（done 擋重複）
    if (pre.complete) swap();
    // 保險：圖卡住不回應時仍要換過去，不能讓封面跟歌曲永久對不上
    const stallTimer = setTimeout(swap, 2000);

    return () => {
      done = true;
      pre.onload = null;
      pre.onerror = null;
      clearTimeout(stallTimer);
      if (removeTimer) clearTimeout(removeTimer);
    };
  }, [src]);

  return (
    <span className={`crossfade-img ${className}`}>
      {previous && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="crossfade-img-layer"
          src={previous}
          alt=""
          aria-hidden="true"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        key={current}
        className="crossfade-img-layer crossfade-img-top"
        src={current}
        alt={alt}
      />
    </span>
  );
}
