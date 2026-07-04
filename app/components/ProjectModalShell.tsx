"use client";

import { useCallback, useEffect, useState } from "react";
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
        className={`proj-modal${closing ? " is-closing" : ""}`}
        onMouseDown={e => e.stopPropagation()}
        data-lenis-prevent
      >
        <div className="proj-modal-head">
          <div>
            <div className={`proj-kicker ${kickerColor}`}>{kicker}</div>
            <div className="proj-modal-title">{title}</div>
            <div className="proj-modal-desc">{desc}</div>
          </div>
          <button type="button" className="proj-modal-close" onClick={requestClose} aria-label="關閉">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
}
