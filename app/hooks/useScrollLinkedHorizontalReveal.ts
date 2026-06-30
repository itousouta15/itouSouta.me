"use client";

import { RefObject, useEffect } from "react";

// Ties the element's horizontal scroll position to how far it has travelled
// through the viewport vertically, so on mobile (where the element is wider
// than the screen and only reachable via overflow-x scroll) the user doesn't
// have to manually swipe it sideways — scrolling the page down auto-reveals
// the rest of the content.
export function useScrollLinkedHorizontalReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const mobileQuery = window.matchMedia("(max-width: 760px)");
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    let ticking = false;

    const update = () => {
      ticking = false;
      if (!mobileQuery.matches || reduceMotionQuery.matches) return;

      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      if (maxScrollLeft <= 0) return;

      const rect = el.getBoundingClientRect();
      const viewportH = window.innerHeight;

      // 0 when the card's top edge first appears at the bottom of the
      // viewport, 1 once its bottom edge has scrolled past the top.
      const progress = (viewportH - rect.top) / (viewportH + rect.height);
      const clamped = Math.min(1, Math.max(0, progress));

      // 卡片進入視窗時 clamped=0 (scrollLeft=0，顯示最左)，
      // 離開視窗時 clamped=1 (scrollLeft=max，顯示最右)，左→右跑完全程。
      el.scrollLeft = clamped * maxScrollLeft;
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);
}
