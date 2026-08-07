"use client";

import { useEffect } from "react";

/* 註冊 service worker（public/sw.js）。只在 https 或 localhost 註冊；
   失敗靜默（例如某些瀏覽器的隱私模式）。 */
export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    if (location.protocol !== "https:" && location.hostname !== "localhost")
      return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
