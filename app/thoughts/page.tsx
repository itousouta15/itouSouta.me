import type { Metadata } from "next";
import PageHead from "../components/PageHead";
import { THOUGHTS } from "../data";
import { fetchThreadsPosts } from "../lib/threads";
import { getThoughts } from "../lib/kv";

const description = "itouSouta 的雜談與生活紀錄，隨手記下的想法與日常。";

export const metadata: Metadata = {
  title: "雜談",
  description,
  alternates: { canonical: "/thoughts" },
  openGraph: { title: "雜談 | itouSouta15.tw", description, url: "/thoughts" },
  twitter: { title: "雜談 | itouSouta15.tw", description },
};

export const revalidate = 3600;

type DisplayItem =
  | { kind: "threads"; id: string; date: string; timestamp: number; text?: string; media_url?: string; permalink?: string }
  | { kind: "discord"; id: string; date: string; timestamp: number; text: string }
  | { kind: "static"; id: string; date: string; text: string; tag?: string };

export default async function ThoughtsPage() {
  const [threadsPosts, kvThoughts] = await Promise.all([
    fetchThreadsPosts().catch(() => []),
    getThoughts().catch(() => []),
  ]);

  const items: Extract<DisplayItem, { kind: "threads" | "discord" }>[] = [];

  for (const p of threadsPosts) {
    items.push({
      kind: "threads",
      id: p.id,
      date: new Date(p.timestamp).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }),
      timestamp: new Date(p.timestamp).getTime(),
      text: p.text,
      media_url: p.media_url,
      permalink: p.permalink,
    });
  }

  for (const t of kvThoughts) {
    items.push({
      kind: "discord",
      id: t.id,
      date: new Date(t.timestamp).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" }),
      timestamp: new Date(t.timestamp).getTime(),
      text: t.text,
    });
  }

  // Sort newest first
  items.sort((a, b) => b.timestamp - a.timestamp);

  const useRemote = items.length > 0;

  return (
    <section>
      <PageHead kicker="THOUGHTS" title="雜談" desc="腦中跑出來的廢話，同步Threads" />
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
