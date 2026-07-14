"use client";

import { useState } from "react";

// 點一下，形狀短暫變成序列裡的下一個形狀再變回來——不是浮動也不是放大縮小，
// 是真的「變形」。四種形狀都用同樣點數（8 點）的 clip-path polygon 定義，
// 瀏覽器才能把兩個 polygon 逐點內插出平滑的變形動畫；混用 circle()/polygon()
// 通常無法內插，只會生硬地跳一下。
const ORDER = ["circle", "triangle", "square", "diamond"] as const;
type ShapeKind = (typeof ORDER)[number];
const MORPH_MS = 620;

export default function BadgeShape({ kind, color }: { kind: ShapeKind; color: string }) {
  const [morphing, setMorphing] = useState(false);
  const nextKind = ORDER[(ORDER.indexOf(kind) + 1) % ORDER.length];

  return (
    <span
      className={`badge-shape badge-shape--${kind}${morphing ? ` badge-shape--morph-to-${nextKind}` : ""}`}
      style={{ background: color }}
      role="button"
      tabIndex={0}
      aria-hidden="true"
      onClick={() => {
        if (morphing) return;
        setMorphing(true);
        setTimeout(() => setMorphing(false), MORPH_MS);
      }}
    />
  );
}
