"use client";

import { useState } from "react";

/* 雜談卡片的按讚按鈕。server 端給初始計數，按下後樂觀 +1、失敗回滾。
   KV 沒開時整個區塊由 server 決定不渲染（見 /writing page）。 */
export default function ThoughtReaction({
  id,
  initial,
}: {
  id: string;
  initial: number;
}) {
  const [count, setCount] = useState(initial);
  const [done, setDone] = useState(false);

  const onClick = async () => {
    if (done) return;
    setCount((c) => c + 1);
    setDone(true);
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const json = await res.json();
      if (res.ok && typeof json.count === "number") setCount(json.count);
      else {
        setCount((c) => Math.max(0, c - 1));
        setDone(false);
      }
    } catch {
      setCount((c) => Math.max(0, c - 1));
      setDone(false);
    }
  };

  return (
    <button
      type="button"
      className={`thought-react${done ? " is-done" : ""}`}
      onClick={onClick}
      aria-label="按讚"
      title="按讚"
    >
      <span className="thought-react-heart">{done ? "♥" : "♡"}</span>
      {count > 0 && <span className="thought-react-count">{count}</span>}
    </button>
  );
}
