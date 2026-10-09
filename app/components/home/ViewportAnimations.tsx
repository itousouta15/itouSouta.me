"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* 保留 Server Component children，只在區塊離開畫面／分頁隱藏時暫停裝飾動畫。
   animation-play-state 會保留播放位置，回到畫面時不會從頭重播。 */
export default function ViewportAnimations({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let inViewport = true;
    const sync = () => {
      el.toggleAttribute(
        "data-animations-paused",
        !inViewport || document.visibilityState !== "visible"
      );
    };
    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(([entry]) => {
            inViewport = entry.isIntersecting;
            sync();
          })
        : null;

    observer?.observe(el);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer?.disconnect();
      document.removeEventListener("visibilitychange", sync);
      el.removeAttribute("data-animations-paused");
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
