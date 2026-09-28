"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

/* 電腦版保留 Lenis；手機版用原生捲動，避免滾輪動畫和畫面合成拖慢滑動。
   偏好減少動態效果時也停用，並監聽斷點／系統設定變更。 */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setEnabled(desktop.matches && !reducedMotion.matches);

    apply();
    desktop.addEventListener("change", apply);
    reducedMotion.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      reducedMotion.removeEventListener("change", apply);
    };
  }, []);

  if (!enabled) return null;
  return <ReactLenis root options={{ wheelMultiplier: 0.8, lerp: 0.1 }} />;
}
