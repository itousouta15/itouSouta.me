"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

/* Lenis 的平滑捲動是全站最大的一項動態效果，而它整個活在 JS 裡，CSS 的
   prefers-reduced-motion 完全管不到——所以要在這裡自己判斷。關掉時直接不掛載，
   捲動就回到瀏覽器原生行為。

   BackToTopButton 的 useLenis() 在沒有 provider 時會拿到 undefined，它本來就有
   `reduceMotion || !lenis` 的分支走 window.scrollTo，所以不用另外處理。 */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  if (!enabled) return null;
  return <ReactLenis root options={{ wheelMultiplier: 0.8, lerp: 0.1 }} />;
}
