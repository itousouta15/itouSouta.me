"use client";

import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export default function Header() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <header className="header">
      <div className="header-inner">
        <Link className="logo" href="/" style={{ textDecoration: "none" }}>
          itouSouta.tw
        </Link>
        <nav className="nav">
          <Link className="nav-link" href="/about" style={{ textDecoration: "none" }}>
            關於我
          </Link>
          <Link className="nav-link" href="/likes" style={{ textDecoration: "none" }}>
            喜歡的東西
          </Link>
          <Link className="nav-link" href="/projects" style={{ textDecoration: "none" }}>
            一些專案
          </Link>
          <button className="theme-btn" onClick={toggle} aria-label="theme">
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="4.2" />
                <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 13.2A8.4 8.4 0 1 1 10.8 3a6.6 6.6 0 0 0 10.2 10.2z" />
              </svg>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
