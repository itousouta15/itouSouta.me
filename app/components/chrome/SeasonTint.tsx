"use client";

import { useEffect } from "react";
import { seasonFor } from "../../lib/season";

/* 依日期在 <html> 上設 data-season，CSS 用 [data-season=...] 覆寫 accent 色票。
   useEffect 才設：SSR 與 server 時區無關，也不會有 hydration mismatch。 */
export default function SeasonTint() {
  useEffect(() => {
    document.documentElement.dataset.season = seasonFor(new Date());
  }, []);
  return null;
}
