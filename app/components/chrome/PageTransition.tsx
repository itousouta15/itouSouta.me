"use client";

import { usePathname } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const previous = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    return () => {
      window.history.scrollRestoration = previous;
    };
  }, []);

  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}
