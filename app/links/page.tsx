import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LINKS } from "../data";
import { avatarThumb } from "../lib/imageThumb";

const description = "itouSouta15.tw 的友情連結，收錄朋友與夥伴們的網站與社群連結。";

export const metadata: Metadata = {
  title: "友鏈",
  description,
  alternates: { canonical: "/links" },
  openGraph: { title: "友鏈 | itouSouta15.tw", description, url: "/links" },
  twitter: { title: "友鏈 | itouSouta15.tw", description },
};

export default function LinksPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="LINKS" title="友鏈" />
      <div className="links-grid">
        {LINKS.map((l, i) => (
          <a className="link-card" key={`${l.href}-${i}`} href={l.href} target="_blank" rel="noopener noreferrer">
            <div className="link-card-head">
              {l.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  className="link-avatar"
                  src={avatarThumb(l.avatar)}
                  alt={l.name}
                  width={48}
                  height={48}
                  loading="lazy"
                  decoding="async"
                />
              ) : (
                <div className="link-avatar link-avatar--placeholder">{l.name[0]}</div>
              )}
              <div className="link-meta">
                <div className="link-name">{l.name}</div>
                <div className="link-handle">{l.handle}</div>
              </div>
              <span className="link-arrow">↗</span>
            </div>
            {l.desc && <div className="link-desc">{l.desc}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}
