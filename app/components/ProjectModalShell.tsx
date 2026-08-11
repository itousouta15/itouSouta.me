"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const CLOSE_MS = 160; // 需與 CSS .is-closing 動畫時長一致

export default function ProjectModalShell({
  kicker,
  kickerColor,
  title,
  desc,
  onClose,
  children,
}: {
  kicker: string;
  kickerColor: "blue" | "purple";
  title: string;
  desc: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [closing, setClosing] = useState(false);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [moreBelow, setMoreBelow] = useState(false);
  const [moreAbove, setMoreAbove] = useState(false);

  // 先播放關閉動畫，動畫結束後才真的通知外層卸載，避免「關掉沒動畫」
  const requestClose = useCallback(() => {
    setClosing(true);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const t = setTimeout(onClose, CLOSE_MS);
    return () => clearTimeout(t);
  }, [closing, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [requestClose]);

  /* modal 自己就是捲動容器，而且捲軸被藏起來（見 .proj-modal 的 scrollbar-width:
     none），內容超過一頁時畫面上沒有任何線索。這裡算「底下還剩多少沒看到」和
     「上面捲掉了多少」，交給 .proj-modal-scroll-hint(-top) 顯示漸層＋箭頭。 */
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const update = () => {
      // 8px 容差：捲到底時 scrollTop 常有次像素誤差，抓太死提示會在底部閃爍
      setMoreBelow(el.scrollHeight - el.clientHeight - el.scrollTop > 8);
      setMoreAbove(el.scrollTop > 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    /* 內容或視窗高度會變（轉向、封面圖載完）。modal 還沒撐到 max-height 時內容
       長高＝自身盒子長高，RO 抓得到；已經滿版的情況本來就已經在顯示提示了。 */
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  // Portal 到 body：modal 若留在 PageTransition 裡，其 transform 動畫會讓
  // position:fixed 改以該元素為定位基準，整個 overlay 位置就跑掉了。
  return createPortal(
    <div
      className={`proj-modal-overlay${closing ? " is-closing" : ""}`}
      onMouseDown={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* data-lenis-prevent：Lenis 會攔截整頁滾輪事件，沒有這個屬性內層容器滾不動 */}
      <div
        ref={scrollerRef}
        className={`proj-modal${closing ? " is-closing" : ""}`}
        onMouseDown={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className={`proj-modal-head${moreAbove ? " is-more-above" : ""}`}>
          <div>
            <div className={`proj-kicker ${kickerColor}`}>{kicker}</div>
            <div className="proj-modal-title">{title}</div>
            <div className="proj-modal-desc">{desc}</div>
          </div>
          <div className="proj-modal-actions">
            <button
              type="button"
              className="proj-modal-close"
              onClick={requestClose}
              aria-label="關閉"
            >
              ✕
            </button>
          </div>
        </div>
        {children}
        {/* 純視覺提示：內容本來就能捲，這裡不提供互動也不進無障礙樹 */}
        <div
          className={`proj-modal-scroll-hint${moreBelow ? " is-visible" : ""}`}
          aria-hidden="true"
        >
          <span className="proj-modal-scroll-hint-arrow">↓</span>
        </div>
      </div>
    </div>,
    document.body
  );
}
