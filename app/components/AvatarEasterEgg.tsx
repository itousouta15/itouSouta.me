"use client";

import { useRef, useState } from "react";
import DecorativeImage from "./DecorativeImage";

const CLICKS_NEEDED = 5;
const SPIN_MS = 600;
// 點太慢就不算連續點擊，重新從 0 開始算
const RESET_AFTER_MS = 1500;

export default function AvatarEasterEgg({
  href,
  src,
  alt,
  className,
}: {
  href: string;
  src: string;
  alt: string;
  className?: string;
}) {
  const [clicks, setClicks] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = () => {
    if (spinning) return;
    if (resetTimer.current) clearTimeout(resetTimer.current);

    const next = clicks + 1;
    if (next < CLICKS_NEEDED) {
      setClicks(next);
      resetTimer.current = setTimeout(() => setClicks(0), RESET_AFTER_MS);
      return;
    }

    setClicks(0);
    setSpinning(true);
    setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
      setSpinning(false);
    }, SPIN_MS);
  };

  return (
    <button
      type="button"
      className={`${className ?? ""}${spinning ? " avatar--spinning" : ""}`}
      aria-label={alt}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <DecorativeImage className="avatar-image" src={src} />
    </button>
  );
}
