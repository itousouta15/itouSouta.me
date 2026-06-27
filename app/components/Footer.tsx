import { Fragment } from "react";
import { MARQUEE } from "../data";

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
        <nav className="footer-projects" aria-label="My Projects">
          <div className="footer-section-label">My Projects</div>
          <div className="footer-project-links">
            <a href="https://itousouta15.tw" target="_blank" rel="noopener nofollow noreferrer">itouSouta</a>
            <a href="https://links.itousouta15.tw" target="_blank" rel="noopener nofollow noreferrer">itouLinks</a>
            <a href="https://slides.itousouta15.tw/" target="_blank" rel="noopener nofollow noreferrer">itouSlides</a>
            <a href="https://cards.itousouta15.tw/" target="_blank" rel="noopener nofollow noreferrer">itouCards</a>
            <a href="https://blog.itousouta15.tw/" target="_blank" rel="noopener nofollow noreferrer">itouBLoGa</a>
          </div>
        </nav>

        <div className="footer-divider" />

        <div className="footer-section-label">Social Media</div>
        <div className="footer-socials" aria-label="Social links">
          <a className="footer-si si-instagram" href="https://www.instagram.com/itou.souta15" target="_blank" rel="noopener nofollow noreferrer" aria-label="Instagram">
            <span className="footer-si-icon" />
          </a>
          <a className="footer-si si-github" href="https://github.com/itousouta15" target="_blank" rel="noopener nofollow noreferrer" aria-label="GitHub">
            <span className="footer-si-icon" />
          </a>
          <a className="footer-si si-x" href="https://x.com/itou_souta15" target="_blank" rel="noopener nofollow noreferrer" aria-label="X">
            <span className="footer-si-icon" />
          </a>
          <a className="footer-si si-discord" href="https://DC.itousouta15.tw" target="_blank" rel="noopener nofollow noreferrer" aria-label="Discord">
            <span className="footer-si-icon" />
          </a>
          <a className="footer-si si-telegram" href="https://t.me/itousouta15" target="_blank" rel="noopener nofollow noreferrer" aria-label="Telegram">
            <span className="footer-si-icon" />
          </a>
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
