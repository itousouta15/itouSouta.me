import { Fragment } from "react";
import Link from "next/link";
import { MARQUEE } from "../data";

const NAV_LINKS = [
  { label: "首頁", href: "/" },
  { label: "關於", href: "/about" },
  { label: "收藏", href: "/likes" },
  { label: "專案", href: "/projects" },
  { label: "友鏈", href: "/links" },
  { label: "經歷", href: "/experience" },
  { label: "雜談", href: "/thoughts" },
];

const PROJECT_LINKS = [
  { label: "itouLinks", href: "https://links.itousouta.me" },
  { label: "itouSlides", href: "https://slides.itousouta.me/" },
  { label: "itouCards", href: "https://cards.itousouta.me/" },
  { label: "itouBLoGa", href: "https://blog.itousouta.me/" },
  { label: "itouOJ", href: "https://oj.itousouta.me/" },
];

const SOCIAL_LINKS = [
  { icon: "instagram", label: "Instagram", href: "https://www.instagram.com/itou.souta15" },
  { icon: "github", label: "GitHub", href: "https://github.com/itousouta15" },
  { icon: "x", label: "X", href: "https://x.com/itou_souta15" },
  { icon: "discord", label: "Discord", href: "https://dc.itousouta.me" },
  { icon: "telegram", label: "Telegram", href: "https://t.me/itousouta15" },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="marquee">
        {[0, 1].map(g => (
          <div className="marquee-group" key={g} aria-hidden={g === 1 ? true : undefined}>
            {MARQUEE.map((m, i) => (
              <Fragment key={i}>
                <span>{m}</span>
                <span className="star">★</span>
              </Fragment>
            ))}
          </div>
        ))}
      </div>

      <div className="footer-inner">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              itouSouta.me
            </Link>
            <p className="footer-tagline">
              情熱を失っては、
              <br />
              何もできない。
            </p>
          </div>

          <nav className="footer-col" aria-label="站內導覽">
            <div className="footer-section-label">Site Map</div>
            <div className="footer-link-list footer-link-list--two-col">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          <nav className="footer-col" aria-label="My Projects">
            <div className="footer-section-label">My Projects</div>
            <div className="footer-link-list">
              {PROJECT_LINKS.map(l => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener nofollow noreferrer">
                  {l.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="footer-col">
            <div className="footer-section-label">Social Media</div>
            <div className="footer-socials" aria-label="Social links">
              {SOCIAL_LINKS.map(s => (
                <a
                  key={s.href}
                  className={`footer-si si-${s.icon}`}
                  href={s.href}
                  target="_blank"
                  rel="noopener nofollow noreferrer"
                  aria-label={s.label}
                >
                  <span className="footer-si-icon" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="icon-copyright" />
            2026
            <span className="footer-heart">♥</span>
            <span>itouSouta</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
