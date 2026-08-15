"use client";

import { useEffect, useState } from "react";

const READY_DELAY_MS = 150;
const MAX_WAIT_MS = 2000;
const SLIDE_MS = 450;

export default function SiteLoader() {
  const [hiding, setHiding] = useState(false);
  const [gone, setGone] = useState(false);
  const [blurred, setBlurred] = useState(false);

  useEffect(() => {
    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setBlurred(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  useEffect(() => {
    // 揭幕的第一觸發點在 layout.tsx <head> 的 inline script（雙 rAF 上毛玻璃
    // → DCL+300ms 遮罩上滑 → +450ms 後 header 進場）。這裡只留兜底路徑：
    // script 若被擋掉，hydration 後一樣能把畫面讓開。
    const inline =
      document.body.classList.contains("site-revealing") ||
      document.body.classList.contains("site-revealed");

    let hideTimer: ReturnType<typeof setTimeout>;
    let removeTimer: ReturnType<typeof setTimeout>;
    let done = false;

    const startHide = () => {
      if (done) return;
      done = true;
      setHiding(true);
      // 畫面往上滑出結束後才讓 header／主畫面開始進場，見 globals.css 的
      // body.site-revealed 規則。
      removeTimer = setTimeout(() => {
        document.body.classList.add("site-revealed");
        setGone(true);
      }, SLIDE_MS);
    };

    if (inline) {
      // inline script 已接手：不要重跑 hide 流程（會把兩段式節奏打亂），
      // 等滑出動畫走完直接收掉節點。捲動鎖由 CSS（body overflow）統一處理。
      removeTimer = setTimeout(() => setGone(true), SLIDE_MS + 400);
    } else if (document.readyState !== "loading") {
      hideTimer = setTimeout(startHide, READY_DELAY_MS);
    } else {
      document.addEventListener("DOMContentLoaded", startHide);
      // 保險：真的卡住時最多等 2 秒仍讓網站顯示
      hideTimer = setTimeout(startHide, MAX_WAIT_MS);
    }

    return () => {
      document.removeEventListener("DOMContentLoaded", startHide);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (gone) return null;

  return (
    <>
      {/* 沒有 JS 就不會觸發滑出與 site-revealed，避免遮罩擋住整個網站、
          header 也卡在進場動畫的起始幀；捲動鎖（body overflow:hidden）
          也要一併解除。 */}
      <noscript>
        <style>{`
          .site-loader { display: none !important; }
          .header {
            animation: none !important;
          }
          body { overflow: auto !important; }
        `}</style>
      </noscript>
      {/* 純視覺遮罩，內容是 CSS 畫的。掛 role="status" aria-live 只會讓螢幕
          閱讀器盯著一個永遠沒有文字的節點，什麼都不會念，不如直接隱藏。 */}
      <div
        className={`site-loader${hiding ? " site-loader--hide" : ""}${blurred ? " site-loader--blurred" : ""}`}
        aria-hidden="true"
      />
    </>
  );
}
