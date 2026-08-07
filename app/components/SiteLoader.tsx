"use client";

import { useEffect, useState } from "react";

const READY_DELAY_MS = 150;
const MAX_WAIT_MS = 2000;
const SLIDE_MS = 600;

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
    document.body.style.overflow = "hidden";

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

    // 這個 effect 是 hydration 之後才跑的，所以 DOM 幾乎一定 parse 完了
    // （readyState 至少是 "interactive"）。以前這裡等的是 window 的 load 事件，
    // 等於要整頁的圖片、wsrv 縮圖、busuanzi 全部回來才肯讓開——但遮罩的職責只是
    // 遮 FOUC，不該押在最慢的那個第三方子資源上。
    if (document.readyState !== "loading") {
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

  useEffect(() => {
    if (gone) document.body.style.overflow = "";
  }, [gone]);

  if (gone) return null;

  return (
    <>
      {/* 沒有 JS 就不會觸發滑出與 site-revealed，避免遮罩擋住整個網站、
          header 也卡在進場動畫的起始幀 */}
      <noscript>
        <style>{`
          .site-loader { display: none !important; }
          .header {
            animation: none !important;
          }
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
