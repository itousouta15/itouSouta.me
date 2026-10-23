"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const callbacks = new WeakMap<Element, () => void>();
let highlightObserver: IntersectionObserver | null = null;

function whenVisible(element: Element, callback: () => void) {
  if (typeof IntersectionObserver === "undefined") {
    callback();
    return () => {};
  }
  highlightObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        highlightObserver?.unobserve(entry.target);
        callbacks.get(entry.target)?.();
        callbacks.delete(entry.target);
      }
    },
    { rootMargin: "300px 0px" }
  );
  callbacks.set(element, callback);
  highlightObserver.observe(element);
  return () => {
    highlightObserver?.unobserve(element);
    callbacks.delete(element);
  };
}

export default function CodeBlock({
  code,
  deferredHighlight = false,
  children,
}: {
  code?: string;
  deferredHighlight?: boolean;
  children: ReactNode;
}) {
  const [status, setStatus] = useState("");
  const block = useRef<HTMLDivElement>(null);
  const rawCode = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!deferredHighlight) return;
    const element = block.current?.querySelector("pre code");
    if (!element) return;
    const source = element.textContent ?? "";
    rawCode.current = source;
    let cancelled = false;
    const unobserve = whenVisible(element, () => {
      void import("./cppHighlight")
        .then(({ tokenizeCpp }) => {
          if (cancelled || !element.isConnected) return;
          const fragment = document.createDocumentFragment();
          for (const token of tokenizeCpp(source)) {
            if (token.kind) {
              const span = document.createElement("span");
              span.className = `cpp-${token.kind}`;
              span.textContent = token.text;
              fragment.appendChild(span);
            } else {
              fragment.appendChild(document.createTextNode(token.text));
            }
          }
          element.replaceChildren(fragment);
        })
        .catch(() => {});
    });
    return () => {
      cancelled = true;
      unobserve();
    };
  }, [deferredHighlight]);
  return (
    <div className="blog-code-block" ref={block}>
      <button
        type="button"
        className="blog-code-copy"
        aria-label="複製程式碼"
        onClick={async () => {
          try {
            const element = block.current?.querySelector("pre code");
            const source = code ?? rawCode.current;
            const text = source ?? element?.textContent ?? "";
            await navigator.clipboard.writeText(text.replace(/\n$/, ""));
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
