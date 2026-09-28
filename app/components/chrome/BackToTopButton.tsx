"use client";

import { useEffect, useState } from "react";
import { useLenis } from "lenis/react";

export default function BackToTopButton() {
  const [visible, setVisible] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 400;
      setVisible((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Once scrolled to top this button hides itself (tabIndex -1); blur it
    // first so focus doesn't get stranded on a now-invisible element.
    e.currentTarget.blur();
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!reduceMotion && lenis) {
      // 電腦版保留原本的飛回頂端動畫；鎖定滾輪避免殘餘慣性覆蓋動畫。
      lenis.scrollTo(0, { lock: true });
    } else {
      window.scrollTo({
        top: 0,
        behavior:
          reduceMotion || window.matchMedia("(max-width: 760px)").matches
            ? "auto"
            : "smooth",
      });
    }
  };

  return (
    <button
      className={`back-to-top${visible ? " is-visible" : ""}`}
      onClick={scrollToTop}
      aria-label="回到頂端"
      tabIndex={visible ? 0 : -1}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
