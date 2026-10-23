import Link from "next/link";
import FooterMarquee from "./FooterMarquee";
import VisitorCounter from "./VisitorCounter";
import { features, site } from "../../template/config";
import { NAV_LINKS as SECTION_LINKS } from "../../lib/navigation";

const NAV_LINKS = [
  { label: "首頁", href: "/" },
  ...SECTION_LINKS,
  ...(features.publicApi ? [{ label: "端點", href: "/api" }] : []),
];

export default function Footer() {
  return (
    <footer className="footer">
      <FooterMarquee />

      <div className="footer-inner">
        <div
          className={`footer-grid${site.featuredLinks.length + site.socials.length === 0 ? " footer-grid--two" : site.featuredLinks.length + site.socials.length === 1 ? " footer-grid--three" : ""}`}
        >
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              {site.title}
            </Link>
            <p className="footer-tagline">{site.quote}</p>
          </div>

          <nav className="footer-col" aria-label="站內導覽">
            <div className="footer-section-label">Site Map</div>
            <div className="footer-link-list footer-link-list--two-col">
              {NAV_LINKS.map((l) => (
                <Link key={l.href} href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </nav>

          {site.featuredLinks.length > 0 && (
            <nav className="footer-col" aria-label="My Projects">
              <div className="footer-section-label">My Projects</div>
              <div className="footer-link-list">
                {site.featuredLinks.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target={l.href.startsWith("/") ? undefined : "_blank"}
                    rel={
                      l.href.startsWith("/")
                        ? undefined
                        : "noopener nofollow noreferrer"
                    }
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </nav>
          )}

          {site.socials.length > 0 && (
            <div className="footer-col">
              <div className="footer-section-label">Social Media</div>
              <div className="footer-socials" aria-label="Social links">
                {site.socials.map((s) => (
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
          )}
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="footer-copyright">
            <span className="icon-copyright" />
            {site.copyrightYear}
            <span className="footer-heart">♥</span>
            <span>{site.author.name}</span>
          </div>
          {features.visitorCounter && <VisitorCounter />}
        </div>
      </div>
    </footer>
  );
}
