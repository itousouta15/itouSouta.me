"use client";

import { useEffect, useState } from "react";

export interface LiveInfo {
  live: boolean;
  url?: string;
}

const POLL_MS = 60_000;

// 只在 vtuber 分類頁掛載（enabled），輪詢 /api/vtuber-live 取得每個頻道的開台狀態。
// API 端本身有 60s revalidate cache，這裡的輪詢間隔跟著對齊，不會多打。
export function useVtuberLiveStatus(enabled: boolean) {
  const [liveMap, setLiveMap] = useState<Record<string, LiveInfo>>({});

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch("/api/vtuber-live");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setLiveMap(data);
      } catch {
        // 開台偵測失敗就維持原狀，不影響頁面其他功能
      }
    };

    load();
    const id = setInterval(load, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enabled]);

  return liveMap;
}
