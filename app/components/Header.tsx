"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";

/* 桌機版導覽列的寬度已經很滿了（961px 斷點 + html 的 zoom: 1.15，實際可用寬度
   比想像中窄，.nav 靠 flex-wrap 兜著）。/stats 只放頁尾，不再往這裡塞。 */
const NAV_LINKS = [
  { label: "關於", href: "/about" },
  { label: "收藏", href: "/likes" },
  { label: "專案", href: "/projects" },
  { label: "文章", href: "/blog" },
  { label: "友鏈", href: "/links" },
  { label: "經歷", href: "/experience" },
  { label: "雜談", href: "/thoughts" },
];

export default function Header() {
  const { theme, toggle, glass, glassCapable, toggleGlass } = useTheme();
  const isDark = theme === "dark";
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  // Overlay only mounts into the DOM while open (see render below), so it can't
  // leak into the SSR HTML that Googlebot indexes. Keeping it mounted for one
  // extra tick after close preserves the CSS fade-out transition.
  const [overlayMounted, setOverlayMounted] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      setOverlayMounted(true);
      return;
    }
    setOverlayVisible(false);
    if (!overlayMounted) return;
    const timer = window.setTimeout(() => setOverlayMounted(false), 300);
    return () => window.clearTimeout(timer);
  }, [open, overlayMounted]);

  useEffect(() => {
    if (!open || !overlayMounted) return;
    const frame = window.requestAnimationFrame(() => {
      setOverlayVisible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, overlayMounted]);

  // Logo 用的 ChenYuLuoYan 字面特別小，載入前 fallback 會先放大、載入完成才縮小（FOUT）。
  // 等該字體就緒後才加上 .fonts-ready 讓 logo 淡入，避免「先變大再縮小」的跳動。
  useEffect(() => {
    const reveal = () => document.documentElement.classList.add("fonts-ready");
    if (!("fonts" in document)) {
      reveal();
      return;
    }
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      reveal();
    };
    document.fonts.load('40px "ChenYuLuoYan"').then(finish).catch(finish);
    // 保險：字體請求失敗或過慢時，最多等 3 秒仍顯示 logo。
    const timer = window.setTimeout(finish, 3000);
    return () => window.clearTimeout(timer);
  }, []);

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
            itouSouta.me
          </Link>
          <div className="header-right">
            <nav className="nav">
              {NAV_LINKS.map((l) => (
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
            <button
              className="theme-btn"
              onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
              aria-label="搜尋 (Ctrl+K)"
              title="搜尋 (Ctrl+K)"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </button>
            {/* Only shown for Firefox-family browsers (glass is only ever
                relevant there) — lets the user turn the auto-enabled glass
                mode back off, or re-enable it. */}
            {glassCapable && (
              <button
                className="theme-btn glass-btn"
                onClick={toggleGlass}
                aria-label="切換半透明背景"
                aria-pressed={glass}
                title={
                  glass
                    ? "關閉半透明背景"
                    : "開啟半透明背景（適合搭配 Zen 瀏覽器的視窗透明）"
                }
              >
                {glass ? (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2.6c.32 0 .62.15.82.4 1.66 2.12 6.68 8.85 6.68 12.45a7.5 7.5 0 0 1-15 0c0-3.6 5.02-10.33 6.68-12.45.2-.25.5-.4.82-.4z" />
                  </svg>
                ) : (
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 2.6c1.66 2.12 6.68 8.85 6.68 12.45a7.5 7.5 0 0 1-15 0c0-3.6 5.02-10.33 6.68-12.45z" />
                  </svg>
                )}
              </button>
            )}
            {/* Glass mode forces dark theme — the translucent tokens are only
                tuned for dark, so there's nothing to toggle to while it's on
                and the button is hidden rather than left non-functional. */}
            {!glass && (
              <button
                className="theme-btn theme-btn--pop-in"
                onClick={toggle}
                aria-label="theme"
              >
                {isDark ? (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19" />
                  </svg>
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M21 13.2A8.4 8.4 0 1 1 10.8 3a6.6 6.6 0 0 0 10.2 10.2z" />
                  </svg>
                )}
              </button>
            )}
            <button
              className={`nav-toggle${open ? " is-open" : ""}`}
              onClick={() => setOpen((o) => !o)}
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
          overlay inside the header's box instead of covering the viewport.
          Only mounted while open: it used to render unconditionally (just
          CSS-hidden), which meant its decorative faces and numbered nav links
          shipped in the initial HTML and got indexed as page content. */}
      {overlayMounted && (
        <div
          id="nav-overlay"
          className={`nav-overlay${overlayVisible ? " is-open" : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label="主選單"
        >
          <div className="nav-overlay-faces" aria-hidden="true">
            {["= ᗜ ω ᗜ.=", "(◕ᗜ◕✿)", "( ˘ω˘ )zzz", "ฅ^•ﻌ•^ฅ", "(´,,•ω•,,)"].map(
              (f, i) => (
                <span
                  key={i}
                  className={`nav-overlay-face nav-overlay-face--${i}`}
                >
                  {f}
                </span>
              )
            )}
          </div>
          <nav className="nav-overlay-links" aria-label="主要導覽">
            {NAV_LINKS.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-overlay-link${pathname === l.href ? " active" : ""}`}
                style={{ "--i": i } as React.CSSProperties}
              >
                <span className="nav-overlay-index">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
