"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export default function CodeBlock({
  code,
  children,
}: {
  code: string;
  children: ReactNode;
}) {
  const [status, setStatus] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <div className="blog-code-block">
      <button
        type="button"
        className="blog-code-copy"
        aria-label="複製程式碼"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code.replace(/\n$/, ""));
            setStatus("已複製");
          } catch {
            setStatus("複製失敗，請選取程式碼");
          }
          clearTimeout(timer.current);
          timer.current = setTimeout(() => setStatus(""), 2200);
        }}
      >
        {status || "複製"}
      </button>
      <span className="sr-only" role="status">
        {status}
      </span>
      {children}
    </div>
  );
}
