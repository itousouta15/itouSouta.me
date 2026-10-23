"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";
import type { PostHeading } from "../../lib/postTypes";
import { activeHeadingAt, type HeadingPosition } from "../../lib/toc";

export default function ArticleToc({ headings }: { headings: PostHeading[] }) {
  const lenis = useLenis();
  const [active, setActive] = useState(headings[0]?.id ?? "");
  const activeRef = useRef(active);
  const navigation = useRef<HTMLElement>(null);
  const mobileNavigation = useRef<HTMLElement>(null);
  const mobileDetails = useRef<HTMLDetailsElement>(null);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  useEffect(() => {
    setPortalRoot(document.body);
  }, []);
  useEffect(() => {
    const sync = () => {
      // 與 BackToTopButton 使用相同的顯示門檻。
      const visible = window.scrollY > 400;
      setBackToTopVisible((current) =>
        current === visible ? current : visible
      );
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => window.removeEventListener("scroll", sync);
  }, []);
  const revealActive = useCallback(() => {
    for (const nav of [navigation.current, mobileNavigation.current]) {
      const link = nav?.querySelector<HTMLAnchorElement>(
        'a[aria-current="location"]'
      );
      if (!nav || !link || !nav.clientHeight) continue;
      const top = link.offsetTop;
      if (
        top < nav.scrollTop + 6 ||
        top + link.offsetHeight > nav.scrollTop + nav.clientHeight - 6
      ) {
        nav.scrollTo({
          top: Math.max(0, top - nav.clientHeight / 2 + link.offsetHeight / 2),
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        });
      }
    }
  }, []);

  useEffect(() => {
    revealActive();
  }, [active, revealActive]);
  useEffect(() => {
    const article = navigation.current?.closest(".blog-article");
    if (!article) return;
    let stopped = false;
    let frame = 0;
    let dirty = true;
    let positions: HeadingPosition[] = [];
    let offset = 128;
    let pageHeight = 0;
    let viewport = window.innerHeight;
    let connected = false;
    const update = () => {
      if (stopped || !positions.length) return;
      const id =
        window.scrollY + viewport >= pageHeight - 8
          ? positions.at(-1)!.id
          : activeHeadingAt(positions, window.scrollY + offset);
      if (id && id !== activeRef.current) {
        activeRef.current = id;
        setActive(id);
      }
    };
    const measure = () => {
      const nodes = new Map(
        [
          ...article.querySelectorAll<HTMLElement>(
            ".blog-prose h2[id], .blog-prose h3[id], .blog-prose h4[id], .blog-prose h5[id], .blog-prose h6[id]"
          ),
        ].map((element) => [element.id, element])
      );
      positions = headings.flatMap(({ id }) => {
        const element = nodes.get(id);
        return element
          ? [{ id, top: element.getBoundingClientRect().top + window.scrollY }]
          : [];
      });
      offset =
        (document.querySelector(".header")?.getBoundingClientRect().height ??
          80) + 48;
      pageHeight = document.documentElement.scrollHeight;
      viewport = window.innerHeight;
      dirty = false;
      update();
    };
    const schedule = (remeasure = false) => {
      if (stopped) return;
      dirty ||= remeasure;
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (dirty) measure();
        else update();
      });
    };
    const scroll = () => schedule();
    const resize = () => schedule(true);
    const observer = new ResizeObserver(resize);
    const transition = article.closest(".page-transition");
    const connect = () => {
      if (
        connected ||
        !article.querySelector(".blog-prose h2[id], .blog-prose h3[id]")
      )
        return;
      connected = true;
      measure();
      observer.observe(article);
      window.addEventListener("scroll", scroll, { passive: true });
      window.addEventListener("resize", resize);
      document.fonts.addEventListener("loadingdone", resize);
      transition?.addEventListener("animationend", resize);
    };
    connect();
    const pending = new MutationObserver(() => {
      connect();
      if (connected) pending.disconnect();
    });
    if (!connected)
      pending.observe(article, { childList: true, subtree: true });
    void document.fonts.ready.then(() => {
      if (!stopped) resize();
    });
    return () => {
      stopped = true;
      cancelAnimationFrame(frame);
      pending.disconnect();
      observer.disconnect();
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", resize);
      document.fonts.removeEventListener("loadingdone", resize);
      transition?.removeEventListener("animationend", resize);
    };
  }, [headings]);

  if (!headings.length) return null;
  const summary = () => (
    <summary>
      文章目錄
      <span className="blog-toc-position" aria-hidden="true">
        {Math.max(
          1,
          headings.findIndex((heading) => heading.id === active) + 1
        )}{" "}
        / {headings.length}
      </span>
    </summary>
  );
  const mobileSummary = () => (
    <summary aria-label="文章目錄" title="文章目錄">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </summary>
  );
  const links = (mobile: boolean) => (
    <nav
      ref={mobile ? mobileNavigation : navigation}
      aria-label="文章目錄"
      data-lenis-prevent
    >
      <ol>
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{
              paddingLeft: `${Math.min(heading.depth - 2, 2) * 12}px`,
            }}
          >
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              onClick={(event) => {
                if (
                  event.defaultPrevented ||
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                const target = document.getElementById(heading.id);
                if (!target) return;
                event.preventDefault();
                const hash = `#${encodeURIComponent(heading.id)}`;
                if (window.location.hash !== hash)
                  window.history.pushState(null, "", hash);
                target.tabIndex = -1;
                target.focus({ preventScroll: true });
                activeRef.current = heading.id;
                setActive(heading.id);
                if (mobile && mobileDetails.current)
                  mobileDetails.current.open = false;
                const reduceMotion = window.matchMedia(
                  "(prefers-reduced-motion: reduce)"
                ).matches;
                if (lenis && !reduceMotion) {
                  lenis.scrollTo(target);
                } else {
                  target.scrollIntoView({
                    behavior: reduceMotion ? "instant" : "smooth",
                    block: "start",
                  });
                }
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
  return (
    <>
      <details
        className="blog-toc blog-toc--desktop"
        open
        onToggle={revealActive}
      >
        {summary()}
        {links(false)}
      </details>
      {portalRoot &&
        createPortal(
          <details
            ref={mobileDetails}
            className={`blog-toc blog-toc--mobile${backToTopVisible ? " is-raised" : ""}`}
            onToggle={revealActive}
          >
            {mobileSummary()}
            {links(true)}
          </details>,
          portalRoot
        )}
    </>
  );
}
