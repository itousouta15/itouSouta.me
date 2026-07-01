import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { THOUGHTS } from "../data";

export const metadata: Metadata = { title: "碎碎念 | itousouta15.tw" };

export default function ThoughtsPage() {
  return (
    <section>
      <PageHead kicker="THOUGHTS" title="碎碎念" desc="腦中跑出來的廢話。" />
      <div className="thoughts-list">
        {[...THOUGHTS].reverse().map((t, i) => (
          <div className="thought-item" key={i}>
            <div className="thought-meta">
              <span className="thought-date">{t.date}</span>
              {t.tag && <span className="thought-tag">{t.tag}</span>}
            </div>
            <p className="thought-text">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
