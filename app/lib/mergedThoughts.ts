import { GITHUB_USERNAME } from "../data";
import { fetchThreadsPosts } from "./threads";
import { getThoughts } from "./kv";
import { getUserEvents } from "./github";

export type MergedThoughtItem =
  | { kind: "threads"; id: string; date: string; timestamp: number; text?: string; media_url?: string; permalink?: string }
  | { kind: "discord"; id: string; date: string; timestamp: number; text: string }
  | { kind: "github"; id: string; date: string; timestamp: number; text: string; url: string };

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export async function getMergedThoughts(): Promise<MergedThoughtItem[]> {
  const [threadsPosts, kvThoughts, githubEvents] = await Promise.all([
    fetchThreadsPosts().catch(() => []),
    getThoughts().catch(() => []),
    getUserEvents(GITHUB_USERNAME).catch(() => []),
  ]);

  const items: MergedThoughtItem[] = [];

  for (const p of threadsPosts) {
    const timestamp = new Date(p.timestamp).getTime();
    items.push({
      kind: "threads",
      id: p.id,
      date: formatDate(timestamp),
      timestamp,
      text: p.text,
      media_url: p.media_url,
      permalink: p.permalink,
    });
  }

  for (const t of kvThoughts) {
    const timestamp = new Date(t.timestamp).getTime();
    items.push({ kind: "discord", id: t.id, date: formatDate(timestamp), timestamp, text: t.text });
  }

  for (const e of githubEvents) {
    const timestamp = new Date(e.createdAt).getTime();
    items.push({
      kind: "github",
      id: e.id,
      date: formatDate(timestamp),
      timestamp,
      text: e.summary,
      url: e.url,
    });
  }

  items.sort((a, b) => b.timestamp - a.timestamp);
  return items;
}
