"use client";

import { RefObject, useEffect } from "react";

export function useHorizontalWheelScroll(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

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
      const delta = Math.max(-80, Math.min(80, e.deltaY)) * 0.6;
      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ref]);
}
