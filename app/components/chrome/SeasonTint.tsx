"use client";

import { useEffect } from "react";

/* 依日期在 <html> 上設 data-season，CSS 用 [data-season=...] 覆寫 accent 色票。
   useEffect 才設：SSR 與 server 時區無關，也不會有 hydration mismatch。 */
function seasonFor(d: Date): string {
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if ((m === 10 && day >= 15) || (m === 11 && day <= 5)) return "halloween";
  if (m === 12) return "christmas";
  if (m === 1 && day <= 10) return "newyear";
  return "";
}

export default function SeasonTint() {
  useEffect(() => {
    document.documentElement.dataset.season = seasonFor(new Date());
  }, []);
  return null;
}
