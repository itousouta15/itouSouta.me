"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  src: string;
  original: string;
  fullSrc?: string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  srcSet?: string;
}
export default function BlogImage({
  src,
  original,
  fullSrc,
  alt,
  title,
  width,
  height,
  srcSet,
}: Props) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (!open || !dialog.current) return;
    const element = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = overflow;
    };
  }, [open]);
  return (
    <span className="blog-image">
      <button
        type="button"
        className="blog-image-open"
        aria-label={`放大圖片：${alt || "文章圖片"}`}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        <img
          src={src}
          srcSet={srcSet}
          sizes="(max-width: 760px) calc(100vw - 40px), 850px"
          alt={alt}
          title={title}
          width={width}
          height={height}
          loading="lazy"
          decoding="async"
        />
      </button>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            className="blog-image-dialog"
            aria-label={alt || "文章圖片"}
            onClose={() => setOpen(false)}
            onClick={(event) => {
              if (event.target === event.currentTarget) setOpen(false);
            }}
            data-lenis-prevent
          >
            <div className="blog-image-dialog-head">
              <span>{alt}</span>
              <button
                type="button"
                aria-label="關閉圖片"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
            <img src={fullSrc ?? original} alt={alt} />
            <a href={original} target="_blank" rel="noopener noreferrer">
              開啟原圖 ↗
            </a>
          </dialog>,
          document.body
        )}
    </span>
  );
}
