"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Like } from "../data";
import { StarRating } from "../lib/ratingStars";

const CLOSE_MS = 160; // 需與 CSS .is-closing 動畫時長一致

export default function LikeModalShell({
  like,
  onClose,
}: {
  like: Like;
  onClose: () => void;
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

  const hasStats = like.rating != null || like.personRating != null || like.status;

  return createPortal(
    <div
      className={`like-modal-overlay${closing ? " is-closing" : ""}`}
      onMouseDown={requestClose}
      role="dialog"
      aria-modal="true"
      aria-label={like.title}
    >
      <div
        className={`like-modal${closing ? " is-closing" : ""}`}
        onMouseDown={e => e.stopPropagation()}
        data-lenis-prevent
      >
        <button type="button" className="like-modal-close" onClick={requestClose} aria-label="關閉">
          ✕
        </button>

        {like.cover && (
          <div className="like-modal-hero">
            <img className="like-modal-hero-bg" src={like.cover} alt="" aria-hidden loading="lazy" decoding="async" />
            <div className="like-modal-hero-fade" />
          </div>
        )}

        <div className={`like-modal-head ${like.cover ? "" : "like-modal-head--flat"}`}>
          {like.cover && (
            <img className="like-modal-cover" src={like.cover} alt={like.title} loading="lazy" decoding="async" />
          )}
          <div className="like-modal-content">
            <div className="like-modal-title">{like.title}</div>
            {like.sub && <div className="like-modal-sub">{like.sub}</div>}
            {like.tags && like.tags.length > 0 && (
              <div className="like-modal-tags">
                {like.tags.map(tag => (
                  <span key={tag} className="like-modal-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            {hasStats && (
              <div className="like-modal-stats">
                {like.rating != null && (
                  <div className="like-modal-stat">
                    <span className="like-modal-stat-label">評分</span>
                    <StarRating rating={like.rating} />
                  </div>
                )}
                {like.personRating != null && (
                  <div className="like-modal-stat like-modal-stat--mine">
                    <span className="like-modal-stat-label">我的評分</span>
                    <StarRating rating={like.personRating} />
                  </div>
                )}
                {like.status && <span className="like-modal-status">{like.status}</span>}
              </div>
            )}
          </div>
        </div>

        {like.href && (
          <a href={like.href} target="_blank" rel="noopener noreferrer" className="btn-primary like-modal-action">
            查看詳情 <span className="btn-arrow">→</span>
          </a>
        )}

        {like.note && (
          <div className="like-modal-note">
            <h3 className="like-modal-note-title">心得</h3>
            <div className="like-modal-note-text">{like.note}</div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
