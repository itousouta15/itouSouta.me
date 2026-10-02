"use client";

import { useEffect } from "react";

// 首次直達首頁時 layout 已預載、安排套用字型；從其他頁面站內導覽回首頁時
// root layout 不會重跑，這裡補上同一份樣式表，維持引言原本的字型。
export default function HomeQuoteFont() {
  useEffect(() => {
    if (document.querySelector("link[data-home-quote-font]")) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://font.emtech.cc/css/LXGWHeartSerif";
    link.dataset.homeQuoteFont = "";
    document.head.appendChild(link);
  }, []);

  return null;
}
