"use client";

import { RefObject, useEffect } from "react";

export function useHorizontalWheelScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // CSS scroll-snap fights small per-tick nudges: each wheel tick only
    // moves a few dozen pixels, well under the snap "proximity" threshold,
    // so the browser snaps straight back to the nearest point (usually the
    // start) right after the tick lands. A regular mouse fires wheel events
    // as discrete, spaced-out notches rather than one continuous stream, so
    // re-enabling snap on a short per-tick idle timer just snaps back after
    // almost every notch. Once wheel-driven scrolling touches this element,
    // disable snapping for good — touch swipes (which don't fire wheel
    // events) keep their native snap behavior untouched.
    const originalSnap = el.style.scrollSnapType;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      // Let a nested vertically-scrollable element (e.g. a song list inside
      // a card) handle the wheel natively while it still has room to scroll,
      // instead of the outer row stealing it for horizontal movement. Only
      // elements actually set to scroll (overflow-y: auto/scroll) count —
      // overflow:hidden elements can report scrollHeight > clientHeight too
      // (sub-pixel rounding) without being scrollable at all.
      let node = e.target as HTMLElement | null;
      while (node && node !== el) {
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
      el.style.scrollSnapType = "none";

      const delta = Math.max(-80, Math.min(80, e.deltaY)) * 0.6;
      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.style.scrollSnapType = originalSnap;
      el.removeEventListener("wheel", onWheel);
    };
  }, [ref]);
}
