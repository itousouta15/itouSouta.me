import { kv } from "@vercel/kv";

export interface KVThought {
  id: string;
  text: string;
  timestamp: string;
}

// 寫入端在獨立的 itouBot 專案（/碎碎念 指令），資料格式需與 KVThought 保持一致
const KEY = "thoughts";

export async function getThoughts(): Promise<KVThought[]> {
  const raw = await kv.lrange<string>(KEY, 0, 49);
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
}

/* ---- 雜談按讚 ----
   單一 hash（key=thought id），/writing 頁 server 端一次 hgetall 就能讀全部，
   不用每個 id 各打一筆。 */
const REACTION_KEY = "reaction:counts";

export async function getReactionCounts(): Promise<Record<string, number>> {
  const all = await kv.hgetall<Record<string, number>>(REACTION_KEY);
  return all ?? {};
}

export async function incrReaction(id: string): Promise<number> {
  return kv.hincrby(REACTION_KEY, id, 1);
}

/* 簡易 IP rate limit：incr 後第一次設 TTL（沒有 TTL 的舊 key 永遠不會過期），
   超過上限回 false。key 前綴分用途（react / 其他），避免互相擠壓額度。 */
export async function rateLimit(
  ip: string,
  scope: string,
  max: number,
  ttlSec: number
): Promise<boolean> {
  const k = `rl:${scope}:${ip}`;
  const n = await kv.incr(k);
  if (n === 1) await kv.expire(k, ttlSec);
  return n <= max;
}

/* ---- 留言板（KV 自建，取代 waline）----
   寫入端是站內的 /api/guestbook，資料存一條 list，最新的在最前面。 */
const GUESTBOOK_KEY = "guestbook";

export interface GuestbookEntry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  const raw = await kv.lrange<string>(GUESTBOOK_KEY, 0, 99);
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
}

export async function addGuestbookEntry(entry: GuestbookEntry): Promise<void> {
  await kv.lpush(GUESTBOOK_KEY, JSON.stringify(entry));
}
