"use client";

import { useState } from "react";
import ThoughtReaction from "./ThoughtReaction";
import type { MergedThoughtItem } from "../../lib/mergedThoughts";
import type { Thought } from "../../data";

const PAGE_SIZE = 8;

/* 雜談區塊一次先只顯示 PAGE_SIZE 筆，按「顯示更多」再往下展開，避免遠端來源
   （Threads / Discord / GitHub 合併後）一次把整頁拉得很長。 */
export default function ThoughtsList({
  items,
  reactionCounts,
  fallback,
}: {
  items: MergedThoughtItem[];
  reactionCounts: Record<string, number> | null;
  fallback: Thought[];
}) {
  const useRemote = items.length > 0;
  const fallbackList = [...fallback].reverse();
  const total = useRemote ? items.length : fallbackList.length;
  const [visible, setVisible] = useState(Math.min(PAGE_SIZE, total));
  const hasMore = visible < total;

  return (
    <>
      <div className="thoughts-list">
        {useRemote
          ? items.slice(0, visible).map((item) => (
              <div className="thought-item" key={item.id}>
                <div className="thought-meta">
                  <span className="thought-date">{item.date}</span>
                  {item.kind === "threads" && item.permalink && (
                    <a
                      className="thought-tag"
                      href={item.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Threads ↗
                    </a>
                  )}
                  {item.kind === "discord" && (
                    <span className="thought-tag">Discord</span>
                  )}
                  {item.kind === "github" && (
                    <a
                      className="thought-tag"
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {reactionCounts && (
                    <ThoughtReaction
                      id={item.id}
                      initial={reactionCounts[item.id] ?? 0}
                    />
                  )}
                </div>
                {item.text && <p className="thought-text">{item.text}</p>}
                {item.kind === "threads" && item.media_url && (
                  <img
                    className="thought-img"
                    src={item.media_url}
                    alt=""
                    loading="lazy"
                  />
                )}
              </div>
            ))
          : fallbackList.slice(0, visible).map((t, i) => (
              <div className="thought-item" key={i}>
                <div className="thought-meta">
                  <span className="thought-date">{t.date}</span>
                  {t.tag && <span className="thought-tag">{t.tag}</span>}
                </div>
                <p className="thought-text">{t.text}</p>
              </div>
            ))}
      </div>
      {hasMore && (
        <button
          type="button"
          className="thoughts-more"
          onClick={() => setVisible((v) => Math.min(v + PAGE_SIZE, total))}
        >
          顯示更多
        </button>
      )}
    </>
  );
}
