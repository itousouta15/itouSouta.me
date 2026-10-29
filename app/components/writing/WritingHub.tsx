"use client";

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { useLenis } from "lenis/react";
import type { PostSummary } from "../../lib/postTypes";
import BlogPreviewImage from "./BlogPreviewImage";

export default function WritingHub({
  posts,
  children,
}: {
  posts: PostSummary[];
  children: ReactNode;
}) {
  const params = useSearchParams();
  const thoughts = params.get("view") === "thoughts";
  const query = params.get("q") ?? "";
  const tag = params.get("tag") ?? "";
  const month = params.get("month") ?? "";
  const previousMonth = useRef(month);
  const postsRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (previousMonth.current === month) return;
    previousMonth.current = month;

    // Animate back to the top after the filtered list has rendered. Respect
    // reduced-motion and use the same smooth scroller as the rest of the site.
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const releaseHeight = () =>
      postsRef.current?.style.removeProperty("min-height");
    if (lenis && !reducedMotion) {
      // Discard Lenis's position from before the filtered list changed.
      lenis.stop();
      lenis.start();
      lenis.scrollTo(0, { lock: true, onComplete: releaseHeight });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reducedMotion ? "instant" : "smooth",
      });
      if (reducedMotion) releaseHeight();
    }

    // Native smooth scrolling has no Lenis completion callback. Keep the old
    // height until we reach the top so the browser cannot clamp mid-animation.
    if (lenis && !reducedMotion) return;
    let frame = 0;
    const deadline = performance.now() + 2000;
    const check = () => {
      if (window.scrollY <= 1 || performance.now() >= deadline) {
        releaseHeight();
      } else {
        frame = window.requestAnimationFrame(check);
      }
    };
    if (!reducedMotion) frame = window.requestAnimationFrame(check);
    return () => window.cancelAnimationFrame(frame);
  }, [month, lenis]);

  const tags = [...new Set(posts.flatMap((post) => post.tags))];
  const months = [
    ...new Set(
      posts
        .filter((post) => post.timestamp <= Date.now())
        .map((post) => post.date.slice(0, 7).replace("/", "-"))
    ),
  ]
    .sort()
    .reverse();
  const years = [...new Set(months.map((value) => value.slice(0, 4)))];
  const filtered = useMemo(() => {
    const terms = query.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    return posts.filter(
      (post) =>
        (!tag || post.tags.includes(tag)) &&
        (!month || post.date.startsWith(month.replace("-", "/"))) &&
        terms.every((term) =>
          [
            post.title,
            post.description,
            post.searchText,
            ...post.categories,
            ...post.tags,
          ]
            .join(" ")
            .toLocaleLowerCase()
            .includes(term)
        )
    );
  }, [posts, query, tag, month]);
  const change = (key: string, value: string) => {
    if (
      key === "month" &&
      window.scrollY > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Preserve the scrollable height while a short month replaces the full
      // list; otherwise the browser snaps to the new bottom before we animate.
      const container = postsRef.current;
      if (container) container.style.minHeight = `${container.offsetHeight}px`;
    }
    const next = new URLSearchParams(params);
    next.delete("category");
    if (value) next.set(key, value);
    else next.delete(key);
    window.history.replaceState(
      null,
      "",
      "/writing" + (next.size ? `?${next}` : "")
    );
  };
  const active = Boolean(query || tag || month);
  return (
    <>
      <div className="writing-tabs" role="tablist" aria-label="文章與碎碎念">
        <button
          type="button"
          role="tab"
          id="writing-posts-tab"
          aria-selected={!thoughts}
          aria-controls="writing-posts-panel"
          tabIndex={thoughts ? -1 : 0}
          onClick={() => change("view", "")}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") {
              change("view", "thoughts");
              document.getElementById("writing-thoughts-tab")?.focus();
            }
          }}
        >
          文章 <span>{posts.length}</span>
        </button>
        <button
          type="button"
          role="tab"
          id="writing-thoughts-tab"
          aria-selected={thoughts}
          aria-controls="writing-thoughts-panel"
          tabIndex={thoughts ? 0 : -1}
          onClick={() => change("view", "thoughts")}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              change("view", "");
              document.getElementById("writing-posts-tab")?.focus();
            }
          }}
        >
          碎碎念
        </button>
        <a className="writing-feed-link" href="/writing/feed.xml">
          RSS ↗
        </a>
      </div>
      <div
        id="writing-posts-panel"
        role="tabpanel"
        aria-labelledby="writing-posts-tab"
        hidden={thoughts}
      >
        <div className="writing-layout">
          <aside
            className="writing-filters"
            aria-label="文章篩選"
            data-lenis-prevent
          >
            <label htmlFor="post-search">搜尋文章</label>
            <input
              id="post-search"
              type="search"
              className="likes-search"
              placeholder="標題、內文、標籤…"
              value={query}
              onChange={(event) => change("q", event.target.value)}
            />
            <div className="writing-filter-label" id="writing-timeline-label">
              時間軸
              <span className="writing-timeline-hint" aria-hidden="true">
                左右滑動
              </span>
            </div>
            <nav
              className="writing-timeline"
              aria-labelledby="writing-timeline-label"
            >
              {years.map((year) => (
                <div className="writing-timeline-year" key={year}>
                  <h3>{year}</h3>
                  <ol className="writing-timeline-months">
                    {months
                      .filter((value) => value.startsWith(year + "-"))
                      .map((value) => {
                        const count = posts.filter((post) =>
                          post.date.startsWith(value.replace("-", "/"))
                        ).length;
                        return (
                          <li key={value}>
                            <button
                              type="button"
                              className="writing-month-button"
                              data-month={value}
                              aria-pressed={month === value}
                              aria-label={`${year} 年 ${Number(value.slice(5))} 月，${count} 篇文章`}
                              onClick={() =>
                                change("month", month === value ? "" : value)
                              }
                            >
                              <span>{Number(value.slice(5))} 月</span>
                              <span aria-hidden="true">{count}</span>
                            </button>
                          </li>
                        );
                      })}
                  </ol>
                </div>
              ))}
            </nav>
            <div className="writing-filter-label">標籤</div>
            <div className="writing-tag-list">
              {tags.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={tag === item}
                  onClick={() => change("tag", tag === item ? "" : item)}
                >
                  #{item}
                </button>
              ))}
            </div>
            {active && (
              <button
                className="writing-clear"
                type="button"
                onClick={() => {
                  const next = new URLSearchParams(params);
                  for (const key of ["q", "category", "tag", "month"])
                    next.delete(key);
                  window.history.replaceState(
                    null,
                    "",
                    "/writing" + (next.size ? `?${next}` : "")
                  );
                }}
              >
                清除篩選
              </button>
            )}
          </aside>
          <div className="writing-posts" ref={postsRef}>
            <p className="writing-result" role="status">
              {filtered.length} 篇文章{active ? `／共 ${posts.length} 篇` : ""}
            </p>
            {filtered.length ? (
              <div className="writing-post-list">
                {filtered.map((post) => (
                  <Link
                    key={post.slug}
                    className={`writing-post-card${post.cover ? "" : " writing-post-card--plain"}`}
                    href={post.path + (params.size ? `?${params}` : "")}
                    prefetch={post.prefetch}
                  >
                    {post.cover && (
                      <div className="writing-post-cover-frame">
                        <BlogPreviewImage
                          className="writing-post-cover"
                          src={post.cover}
                          alt=""
                          width={post.coverWidth}
                          height={post.coverHeight}
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="writing-post-card-body">
                      <div className="writing-post-meta">
                        <time dateTime={post.dateISO}>{post.date}</time>
                        {post.pinned && <span>置頂</span>}
                        <span>{post.wordCount.toLocaleString("zh-TW")} 字</span>
                        <span>{post.readingMinutes} 分鐘</span>
                      </div>
                      <h2>
                        {post.title}
                        <span aria-hidden="true">↗</span>
                      </h2>
                      <p>{post.description}</p>
                      <div className="writing-card-tags">
                        {post.categories.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                        {post.tags.map((item) => (
                          <span key={item}>#{item}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="likes-empty">
                沒有符合條件的文章，試試其他關鍵字或清除篩選。
              </p>
            )}
          </div>
        </div>
      </div>
      <div
        id="writing-thoughts-panel"
        role="tabpanel"
        aria-labelledby="writing-thoughts-tab"
        hidden={!thoughts}
      >
        {children}
      </div>
    </>
  );
}
