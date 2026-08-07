"use client";

import { useEffect, useState } from "react";

const COLORS = [
  "#ffa84c",
  "#ff6b6b",
  "#7ee7a0",
  "#b0bdf7",
  "#c084fc",
  "#f5c26b",
];
const GLYPHS = ["★", "✿", "♪", "♥", "▲"];
const PIECES = 40;

interface Piece {
  left: number;
  delay: number;
  dur: number;
  color: string;
  glyph: string | null;
}

/* 監聽 konami:burst，噴一次 40 片紙屑。burst 計數器當 key：重複觸發會整個重掛。
   prefers-reduced-motion 時全域規則把 animation 時長壓到 0.01ms → 直接跳到終態
   （畫面外），等同不播。 */
export default function ConfettiBurst() {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const onBurst = () => setBurst((b) => b + 1);
    window.addEventListener("konami:burst", onBurst);
    return () => window.removeEventListener("konami:burst", onBurst);
  }, []);

  useEffect(() => {
    if (burst === 0) return;
    const t = setTimeout(() => setBurst(0), 3200);
    return () => clearTimeout(t);
  }, [burst]);

  if (burst === 0) return null;

  const pieces: Piece[] = Array.from({ length: PIECES }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    dur: 1.2 + Math.random() * 0.8,
    color: COLORS[i % COLORS.length],
    glyph: i % 3 === 0 ? GLYPHS[i % GLYPHS.length] : null,
  }));

  return (
    <div className="confetti" key={burst} aria-hidden>
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.dur}s`,
            background: p.glyph ? "transparent" : p.color,
            color: p.color,
          }}
        >
          {p.glyph ?? ""}
        </span>
      ))}
    </div>
  );
}
