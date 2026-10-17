"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import type { ProjectScreenshot } from "../../data/projects";
import { projectCoverThumb } from "../../lib/imageThumb";

function GalleryArrow({ next = false }: { next?: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={next ? "m9 5 7 7-7 7" : "m15 5-7 7 7 7"} />
    </svg>
  );
}

export default function ProjectGallery({
  title,
  images,
}: {
  title: string;
  images: ProjectScreenshot[];
}) {
  const id = useId();
  const [index, setIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const dialog = useRef<HTMLDialogElement>(null);
  const thumbs = useRef<(HTMLButtonElement | null)[]>([]);
  const gesture = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);
  const image = images[index];
  const previousImage = previousIndex == null ? null : images[previousIndex];
  const multiple = images.length > 1;
  const imageState = !previousImage
    ? "idle"
    : loadedSrc === image?.src || failed.has(image?.src)
      ? "running"
      : "loading";

  useEffect(() => {
    if (imageState !== "running") return;
    const timer = window.setTimeout(() => setPreviousIndex(null), 360);
    return () => window.clearTimeout(timer);
  }, [imageState, index]);

  useEffect(() => {
    const strip = thumbs.current[index]?.parentElement;
    const thumb = thumbs.current[index];
    if (!strip || !thumb) return;
    // Only move the thumbnail strip, never the page or its smooth-scroll state.
    strip.scrollTo({
      left: thumb.offsetLeft - strip.clientWidth / 2 + thumb.offsetWidth / 2,
    });
  }, [index]);

  useEffect(() => {
    if (!expanded) return;
    const element = dialog.current;
    if (!element) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    element.showModal();
    return () => {
      if (element.open) element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [expanded]);

  const select = (next: number, fromDirection?: "next" | "prev") => {
    const target = (next + images.length) % images.length;
    if (target === index) return;
    // Keep the visible image while the next one loads, including rapid clicks.
    if (imageState !== "loading") setPreviousIndex(index);
    setDirection(fromDirection ?? (next < index ? "prev" : "next"));
    setIndex(target);
  };
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!multiple || event.altKey || event.ctrlKey || event.metaKey) return;
    const next =
      event.key === "ArrowLeft"
        ? (index - 1 + images.length) % images.length
        : event.key === "ArrowRight"
          ? (index + 1) % images.length
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? images.length - 1
              : null;
    if (next == null) return;
    event.preventDefault();
    select(
      next,
      event.key === "ArrowLeft"
        ? "prev"
        : event.key === "ArrowRight"
          ? "next"
          : undefined
    );
    if ((event.target as HTMLElement).closest(".project-gallery-thumb"))
      thumbs.current[next]?.focus({ preventScroll: true });
  };
  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    swiped.current = false;
    if (event.pointerType !== "touch" || !multiple) return;
    gesture.current = { x: event.clientX, y: event.clientY };
  };
  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!gesture.current) return;
    const dx = event.clientX - gesture.current.x;
    const dy = event.clientY - gesture.current.y;
    gesture.current = null;
    // Open a touch tap directly. Browsers can suppress the compatibility click
    // immediately after a swipe, even though pointer events still arrive.
    if (
      Math.abs(dx) < 10 &&
      Math.abs(dy) < 10 &&
      (event.target as HTMLElement).closest(".project-gallery-open")
    ) {
      setExpanded(true);
      return;
    }
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    swiped.current = true;
    select(index + (dx < 0 ? 1 : -1));
  };
  const renderImage = (large = false) =>
    failed.has(image.src) ? (
      <div className="project-gallery-unavailable" role="status">
        <p>圖片暫時無法載入</p>
        <a href={image.src} target="_blank" rel="noopener noreferrer">
          開啟原圖 ↗
        </a>
      </div>
    ) : (
      <img
        key={image.src}
        className={
          large ? "project-gallery-full-image" : "project-gallery-image"
        }
        src={image.src}
        alt={image.alt}
        decoding="async"
        draggable={false}
        onLoad={() => setLoadedSrc(image.src)}
        onError={() =>
          setFailed((previous) => new Set(previous).add(image.src))
        }
      />
    );
  const renderPreviousImage = (large = false) =>
    previousImage &&
    !failed.has(previousImage.src) && (
      <img
        key={`previous-${index}-${previousImage.src}`}
        className={`${large ? "project-gallery-full-image" : "project-gallery-image"} project-gallery-outgoing`}
        src={previousImage.src}
        alt=""
        aria-hidden="true"
        draggable={false}
        decoding="async"
      />
    );
  const controls = (large = false) =>
    multiple && (
      <>
        <button
          type="button"
          className={`project-gallery-arrow project-gallery-prev${large ? " is-large" : ""}`}
          aria-label="上一張圖片"
          onClick={() => select(index - 1)}
        >
          <GalleryArrow />
        </button>
        <button
          type="button"
          className={`project-gallery-arrow project-gallery-next${large ? " is-large" : ""}`}
          aria-label="下一張圖片"
          onClick={() => select(index + 1)}
        >
          <GalleryArrow next />
        </button>
      </>
    );

  if (!image) return null;
  return (
    <section
      className="project-gallery"
      aria-label={`${title} 圖片展示`}
      aria-roledescription="圖片輪播"
      data-image-state={imageState}
      data-direction={direction}
      onKeyDown={onKeyDown}
    >
      <div
        className="project-gallery-stage"
        id={`${id}-preview`}
        role={multiple ? "tabpanel" : undefined}
        aria-labelledby={multiple ? `${id}-thumb-${index}` : undefined}
      >
        <div
          className="project-gallery-slide"
          role="group"
          aria-roledescription="圖片"
          aria-label={`第 ${index + 1} 張，共 ${images.length} 張`}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          {failed.has(image.src) ? (
            renderImage()
          ) : (
            <button
              className="project-gallery-open"
              type="button"
              aria-label={`放大圖片：${image.alt}`}
              aria-haspopup="dialog"
              onClick={() => {
                if (!swiped.current) setExpanded(true);
              }}
            >
              {renderImage()}
              {renderPreviousImage()}
            </button>
          )}
        </div>
        {controls()}
        <button
          className="project-gallery-expand"
          type="button"
          onClick={() => setExpanded(true)}
          onPointerUp={(event) => {
            if (event.pointerType === "touch") setExpanded(true);
          }}
          aria-label="放大檢視圖片"
          aria-haspopup="dialog"
        >
          <span aria-hidden="true">⛶</span>
        </button>
        {multiple && (
          <span className="project-gallery-count" aria-hidden="true">
            {index + 1} / {images.length}
          </span>
        )}
      </div>
      <div
        className="project-gallery-description"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <span className="sr-only">
          {index + 1} / {images.length}：
        </span>
        {image.caption || image.alt}
      </div>
      {multiple && (
        <div
          className="project-gallery-thumbs"
          role="tablist"
          aria-label="選擇專案圖片"
          data-lenis-prevent-wheel
        >
          {images.map((item, i) => (
            <button
              key={item.src}
              ref={(el) => {
                thumbs.current[i] = el;
              }}
              id={`${id}-thumb-${i}`}
              className={`project-gallery-thumb${i === index ? " is-active" : ""}`}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`第 ${i + 1} 張：${item.alt}`}
              aria-controls={`${id}-preview`}
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
            >
              <img
                src={projectCoverThumb(item.src)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                onError={(event) => {
                  event.currentTarget.style.visibility = "hidden";
                }}
              />
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      )}
      <dialog
        ref={dialog}
        className="project-gallery-lightbox"
        aria-label={`${title} 圖片檢視器`}
        onClose={() => setExpanded(false)}
        onKeyDown={(event) => {
          event.stopPropagation();
          onKeyDown(event);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) setExpanded(false);
        }}
        data-lenis-prevent
      >
        <div className="project-gallery-lightbox-toolbar">
          <span>
            {index + 1} / {images.length}
          </span>
          <button
            type="button"
            className="project-gallery-close"
            aria-label="關閉圖片檢視器"
            onClick={() => setExpanded(false)}
            onPointerUp={(event) => {
              if (event.pointerType === "touch") setExpanded(false);
            }}
          >
            ✕
          </button>
        </div>
        <div
          className="project-gallery-lightbox-stage"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            gesture.current = null;
          }}
        >
          {renderImage(true)}
          {renderPreviousImage(true)}
          {controls(true)}
        </div>
        <p
          className="project-gallery-lightbox-caption"
          role="status"
          aria-live="polite"
        >
          {image.caption || image.alt}
        </p>
      </dialog>
    </section>
  );
}
