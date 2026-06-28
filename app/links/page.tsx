import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { LINKS } from "../data";

export const metadata: Metadata = { title: "友鏈 | itouSouta.tw" };

export default function LinksPage() {
  return (
    <section className="fade-in" style={{ paddingBottom: 8 }}>
      <PageHead kicker="LINKS" title="友鏈" />
      <div className="links-grid">
        {LINKS.map((l, i) => (
          <a className="link-card" key={`${l.href}-${i}`} href={l.href} target="_blank" rel="noopener noreferrer">
            <div className="link-top">
              <span className={`link-dot ${l.color ?? "blue"}`} />
              <span className="link-arrow">↗</span>
            </div>
            <div className="link-name">{l.name}</div>
            <div className="link-handle">{l.handle}</div>
            {l.desc && <div className="link-desc">{l.desc}</div>}
          </a>
        ))}
      </div>
    </section>
  );
}
