import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { THOUGHTS } from "../data";
import { getMergedThoughts } from "../lib/mergedThoughts";

const description = "itouSouta 的雜談與生活紀錄，隨手記下的想法與日常。";

export const metadata: Metadata = {
  title: "雜談",
  description,
  alternates: { canonical: "/thoughts" },
  openGraph: { title: "雜談 | itouSouta15.tw", description, url: "/thoughts" },
  twitter: { title: "雜談 | itouSouta15.tw", description },
};

export const revalidate = 3600;

export default async function ThoughtsPage() {
  const items = await getMergedThoughts();
  const useRemote = items.length > 0;

  return (
    <section>
      <PageHead kicker="THOUGHTS" title="雜談" desc="腦中跑出來的廢話，同步 Threads / GitHub / Discord" />
      <div className="thoughts-list">
        {useRemote
          ? items.map((item) => (
              <div className="thought-item" key={item.id}>
                <div className="thought-meta">
                  <span className="thought-date">{item.date}</span>
                  {item.kind === "threads" && item.permalink && (
                    <a className="thought-tag" href={item.permalink} target="_blank" rel="noopener noreferrer">
                      Threads ↗
                    </a>
                  )}
                  {item.kind === "discord" && (
                    <span className="thought-tag">Discord</span>
                  )}
                  {item.kind === "github" && (
                    <a className="thought-tag" href={item.url} target="_blank" rel="noopener noreferrer">
                      GitHub ↗
                    </a>
                  )}
                </div>
                {item.text && <p className="thought-text">{item.text}</p>}
                {item.kind === "threads" && item.media_url && (
                  <img className="thought-img" src={item.media_url} alt="" loading="lazy" />
                )}
              </div>
            ))
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
