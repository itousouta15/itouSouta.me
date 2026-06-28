"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "關於", href: "/about" },
  { label: "收藏", href: "/likes" },
  { label: "專案", href: "/projects" },
  { label: "友鏈", href: "/links" },
  { label: "經歷", href: "/experience" },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link className="logo" href="/" style={{ textDecoration: "none" }}>
            itouSouta.tw
          </Link>
          <div className="header-right">
            <nav className="nav">
              {NAV_LINKS.map(l => (
                <Link
                  key={l.href}
                  className={`nav-link${pathname === l.href ? " active" : ""}`}
                  href={l.href}
                  style={{ textDecoration: "none" }}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <button className="theme-btn" onClick={toggle} aria-label="theme">
              {isDark ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="4.2" />
                  <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 13.2A8.4 8.4 0 1 1 10.8 3a6.6 6.6 0 0 0 10.2 10.2z" />
                </svg>
              )}
            </button>
            <button
              className={`nav-toggle${open ? " is-open" : ""}`}
              onClick={() => setOpen(o => !o)}
              aria-label={open ? "關閉選單" : "開啟選單"}
              aria-expanded={open}
              aria-controls="nav-overlay"
            >
              <span className="nav-toggle-bar" />
              <span className="nav-toggle-bar" />
            </button>
          </div>
        </div>
      </header>

      {/* Sibling of <header>, not nested inside it — .header has backdrop-filter,
          which creates a containing block for position:fixed and would trap this
          overlay inside the header's box instead of covering the viewport. */}
      <div id="nav-overlay" className={`nav-overlay${open ? " is-open" : ""}`} role="dialog" aria-modal="true" aria-label="主選單">
        <nav className="nav-overlay-links" aria-label="主要導覽">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              className={`nav-overlay-link${pathname === l.href ? " active" : ""}`}
              style={{ "--i": i } as React.CSSProperties}
            >
              <span className="nav-overlay-index">{String(i + 1).padStart(2, "0")}</span>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
