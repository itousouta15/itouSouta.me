"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import type { LenisRef } from "lenis/react";

// 手機與 reduced-motion 不會掛載 Lenis，也不需要下載其實作。
const ReactLenis = dynamic(
  () => import("lenis/react").then((mod) => mod.ReactLenis),
  { ssr: false }
);

/* 電腦版保留 Lenis；手機版用原生捲動，避免滾輪動畫和畫面合成拖慢滑動。
   偏好減少動態效果時也停用，並監聽斷點／系統設定變更。 */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const lenisRef = useRef<LenisRef>(null);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;
    if (window.location.hash) return;

    // Reset the native scroll and Lenis together: an in-flight Lenis animation
    // otherwise writes the previous page's position back on its next frame.
    const reset = () => {
      const lenis = lenisRef.current?.lenis;
      lenis?.stop();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      lenis?.start();
    };
    reset();
    // Next.js may still adjust focus/scroll during the route commit. Repeat
    // after that commit so the new page starts at the top on desktop and mobile.
    const frame = window.requestAnimationFrame(reset);
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

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
  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{ wheelMultiplier: 0.8, lerp: 0.1, stopInertiaOnNavigate: true }}
    />
  );
}
