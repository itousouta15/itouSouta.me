"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useLayoutEffect, useRef } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const previousPathname = useRef<string | null>(null);

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  useLayoutEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    // Keep deliberate links to a section (including a direct load with #hash).
    if (window.location.hash) return;

    // SmoothScroll cancels desktop Lenis animations on the same route change.
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
