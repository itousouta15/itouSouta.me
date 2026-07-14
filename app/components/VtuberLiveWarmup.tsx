"use client";

import { useEffect } from "react";

// /api/vtuber-live 第一次沒快取要掃 30 幾個頻道，實測要 3 秒左右；60s 內有快取的話
// 0.2 秒就回來了。這顆掛在 /likes 首頁，人都還沒點進 VTuber 分類就先把快取熱好，
// 真正點進去時 useVtuberLiveStatus 那次 fetch 幾乎是秒回，不用乾等紅框跑出來。
export default function VtuberLiveWarmup() {
  useEffect(() => {
    fetch("/api/vtuber-live").catch(() => {});
  }, []);
  return null;
}
