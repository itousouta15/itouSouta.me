"use client";

import { useEffect, useRef, useState } from "react";

// 只是「稍微」跟著滑鼠瞄過去的感覺，不是真的貼著游標——位移量夾在極小範圍內，
// 用 requestAnimationFrame 節流，避免 mousemove 高頻率觸發把 React state 灌爆
const MAX_OFFSET = 6;
const FOLLOW_STRENGTH = 0.04;

// 點左邊/右邊眨那一邊的眼睛，眨完自動回到原本該顯示的表情（消不消失都算）
const WINK_MS = 300;

type FaceKey = "normal" | "leaving" | "winkLeft" | "winkRight";

const FACES: Record<FaceKey, string> = {
  normal: "= ᗜ ω ᗜ.=",
  leaving: "= > ω <.=",
  winkLeft: "= > ω ᗜ.=",
  winkRight: "= ᗜ ω <.=",
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export default function HeroFace() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [leaving, setLeaving] = useState(false);
  const [wink, setWink] = useState<"left" | "right" | null>(null);
  const winkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let raf = 0;
    let pending: { x: number; y: number } | null = null;

    const apply = () => {
      if (pending) setOffset(pending);
      raf = 0;
    };

    const handleMove = (e: MouseEvent) => {
      const rect = trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pending = {
        x: clamp((e.clientX - cx) * FOLLOW_STRENGTH, -MAX_OFFSET, MAX_OFFSET),
        y: clamp((e.clientY - cy) * FOLLOW_STRENGTH, -MAX_OFFSET, MAX_OFFSET),
      };
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    // rootMargin 把觀察範圍縮成只剩畫面最上面那一小條，臉滑到那個區間裡
    // 才算「快要消失」，不是隨便滾一下就切換
    const observer = new IntersectionObserver(([entry]) => setLeaving(entry.isIntersecting), {
      rootMargin: "0px 0px -80% 0px",
      threshold: 0,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => {
    if (winkTimer.current) clearTimeout(winkTimer.current);
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const side = e.clientX < rect.left + rect.width / 2 ? "left" : "right";
    setWink(side);
    if (winkTimer.current) clearTimeout(winkTimer.current);
    winkTimer.current = setTimeout(() => setWink(null), WINK_MS);
  };

  // 眨眼優先於捲動快消失那個表情，眨完自動退回 leaving 目前該顯示的狀態
  const activeFace: FaceKey = wink === "left" ? "winkLeft" : wink === "right" ? "winkRight" : leaving ? "leaving" : "normal";

  // 三層結構是刻意分開的：
  // - 最外層只管跟著滑鼠位移（JS 算出來的 inline transform）
  // - 中間層只管快消失時持續搖擺（CSS animation 控制 transform，直接綁 leaving，
  //   不是切換瞬間搖一下就停——只要還在快消失的區間就一直搖）
  //   兩個都會動 transform，疊在同一個元素上會互相打架（跟之前開台紅框被
  //   overflow 咬掉是同一類坑），所以分成兩層各管各的
  // - 最內層四種表情疊在同一格，純靠 opacity 交叉淡入淡出，同一時間只有一個可見
  return (
    <div
      className="hero-face-mouse"
      ref={trackRef}
      style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
    >
      <div
        className={`hero-face-track${leaving ? " hero-face-track--wiggle" : ""}`}
        onClick={handleClick}
      >
        {(Object.keys(FACES) as FaceKey[]).map(key => (
          <span key={key} className={`hero-face${activeFace === key ? "" : " hero-face--out"}`}>
            {FACES[key]}
          </span>
        ))}
      </div>
    </div>
  );
}
