"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/visitors")
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (!cancelled && data) setCount(data.count);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return <span className="footer-visitors">造訪人數 {count.toLocaleString("zh-TW")}</span>;
}
