import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { THOUGHTS } from "../data";
import { fetchThreadsPosts } from "../lib/threads";

export const metadata: Metadata = { title: "碎碎念 | itousouta15.tw" };

export const revalidate = 3600;

export default async function ThoughtsPage() {
  const threadsPosts = await fetchThreadsPosts();

  const useThreads = threadsPosts.length > 0;

  return (
    <section>
      <PageHead kicker="THOUGHTS" title="碎碎念" desc="腦中跑出來的廢話。" />
      <div className="thoughts-list">
        {useThreads
          ? threadsPosts.map((p) => {
              const date = new Date(p.timestamp).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              });
              return (
                <div className="thought-item" key={p.id}>
                  <div className="thought-meta">
                    <span className="thought-date">{date}</span>
                    {p.permalink && (
                      <a
                        className="thought-tag"
                        href={p.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Threads ↗
                      </a>
                    )}
                  </div>
                  <p className="thought-text">{p.text}</p>
                </div>
              );
            })
          : [...THOUGHTS].reverse().map((t, i) => (
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
