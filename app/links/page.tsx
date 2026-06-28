import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LINKS } from "../data";

export const metadata: Metadata = { title: "友鏈 | itousouta15.tw" };

export default function LinksPage() {
  return (
    <section style={{ paddingBottom: 8 }}>
      <PageHead kicker="LINKS" title="友鏈" />
      <div className="links-grid">
        {LINKS.map((l, i) => (
          <a className="link-card" key={`${l.href}-${i}`} href={l.href} target="_blank" rel="noopener noreferrer">
            <div className="link-top">
              <span className="link-arrow">↗</span>
            </div>
            <div className="link-main">
              {l.avatar && <img className="link-avatar" src={l.avatar} alt="" />}
              <div className="link-meta">
                <div className="link-name">{l.name}</div>
                <div className="link-handle">{l.handle}</div>
              </div>
            </div>
            {l.desc && <div className="link-desc">{l.desc}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}
