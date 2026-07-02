"use client";

import { useEffect } from "react";

// Global inertia scrolling for the page: wheel events ease the window's
// scroll position toward a target instead of jumping straight to it.
// Skips events already handled elsewhere (e.g. the horizontal carousel
// hook calls preventDefault on its own), pinch-zoom (ctrlKey), and any
// nested vertically-scrollable element that still has room to scroll.
export function useSmoothScroll(intensity = 0.14) {
  useEffect(() => {
    let target = window.scrollY;
    let raf: number | null = null;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const step = () => {
      const current = window.scrollY;
      const next = current + (target - current) * intensity;
      if (Math.abs(target - next) < 0.5) {
        window.scrollTo(0, target);
        raf = null;
        return;
      }
      window.scrollTo(0, next);
      raf = requestAnimationFrame(step);
    };

    const onWheel = (e: WheelEvent) => {
      if (e.defaultPrevented || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      let node = e.target as HTMLElement | null;
      while (node && node !== document.body) {
        const overflowY = getComputedStyle(node).overflowY;
        const isScrollable = overflowY === "auto" || overflowY === "scroll";
        if (isScrollable && node.scrollHeight > node.clientHeight) {
          const canScrollDown = e.deltaY > 0 && node.scrollTop + node.clientHeight < node.scrollHeight - 1;
          const canScrollUp = e.deltaY < 0 && node.scrollTop > 0;
          if (canScrollDown || canScrollUp) return;
          break;
        }
        node = node.parentElement;
      }

      e.preventDefault();
      if (raf == null) target = window.scrollY;
      target = Math.max(0, Math.min(maxScroll(), target + e.deltaY));
      if (raf == null) raf = requestAnimationFrame(step);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (raf != null) cancelAnimationFrame(raf);
    };
  }, [intensity]);
}
