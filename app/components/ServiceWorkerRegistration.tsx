"use client";

import { useEffect } from "react";

/* 註冊 service worker（public/sw.js）。只在正式環境（https）註冊。
   開發模式一律反註冊：next dev 的 /_next/static chunk 每次重建就換檔名，SW 的
   stale-while-revalidate 會讓瀏覽器吃舊 chunk，頁面直接卡死——SW 是 production
   功能，dev 只會添亂。 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "development") {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((r) => r.unregister()))
        .catch(() => {});
      return;
    }

    if (location.protocol !== "https:" && location.hostname !== "localhost")
      return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
