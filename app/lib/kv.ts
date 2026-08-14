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
   每個頁面各自一條 list（key 按 path 分），彼此獨立，不共用同一份留言。
   回覆另外存在同一頁面的 hash（field = 頂層留言 id → 回覆陣列），回覆的
   parentId 指向被回覆的留言或回覆，前端據此組巢狀樓中樓。 */

const guestbookKey = (path: string) => `guestbook:${path}`;
const guestbookRepliesKey = (path: string) => `guestbook-replies:${path}`;

export interface GuestbookEntry {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  // 舊留言沒有這幾個欄位，JSON.parse 出來會是 undefined，渲染端當成沒有處理
  avatar?: string | null;
  link?: string | null;
  source?: "manual" | "github";
  // 只在送出時存著供回覆通知用，讀取時一律剝掉，絕不回傳到前端
  email?: string | null;
}

export interface GuestbookReply {
  id: string;
  nick: string;
  text: string;
  timestamp: string;
  parentId: string;
  replyToNick: string;
  avatar?: string | null;
  link?: string | null;
  source?: "manual" | "github";
  email?: string | null;
}

/** email 只存在 KV 裡給回覆通知用，任何對外的讀取路徑都要剝掉。 */
function stripEmail<T extends { email?: string | null }>(item: T): T {
  const { email: _email, ...rest } = item;
  return rest as T;
}

export async function getGuestbookEntries(
  path: string
): Promise<GuestbookEntry[]> {
  const raw = await kv.lrange<string>(guestbookKey(path), 0, 99);
  return raw
    .map((r) => (typeof r === "string" ? JSON.parse(r) : r))
    .map(stripEmail);
}

export async function addGuestbookEntry(
  entry: GuestbookEntry,
  path: string
): Promise<void> {
  await kv.lpush(guestbookKey(path), JSON.stringify(entry));
}

/** 內部用：找頂層留言的原始資料（含 email），只給回覆通知用，別拿去對外回傳。 */
export async function findGuestbookEntryRaw(
  path: string,
  id: string
): Promise<GuestbookEntry | null> {
  const raw = await kv.lrange<string>(guestbookKey(path), 0, 99);
  for (const r of raw) {
    const entry = (typeof r === "string" ? JSON.parse(r) : r) as GuestbookEntry;
    if (entry.id === id) return entry;
  }
  return null;
}

/** 撈某一頁全部留言的回覆：{ 頂層留言 id: 回覆陣列 }。回覆陣列是扁平的，
 * 誰接在誰底下靠每個回覆的 parentId 自己組。 */
export async function getGuestbookReplies(
  path: string
): Promise<Record<string, GuestbookReply[]>> {
  const all = await kv.hgetall<Record<string, GuestbookReply[]>>(
    guestbookRepliesKey(path)
  );
  if (!all) return {};
  for (const [key, replies] of Object.entries(all)) {
    all[key] = replies.map(stripEmail);
  }
  return all;
}

/** 回覆要同時知道「被回覆的頂層留言 id」跟「被回覆者的 email」，所以這裡
 *  回傳整串頂層留言底下的全部回覆，由呼叫端找出 parent 本人。 */
export async function getRepliesForComment(
  path: string,
  commentId: string
): Promise<GuestbookReply[]> {
  const raw = await kv.hget<string>(guestbookRepliesKey(path), commentId);
  if (!raw) return [];
  return (typeof raw === "string" ? JSON.parse(raw) : raw) as GuestbookReply[];
}

export async function addGuestbookReply(
  path: string,
  commentId: string,
  reply: GuestbookReply
): Promise<void> {
  const key = guestbookRepliesKey(path);
  const raw = await kv.hget<string>(key, commentId);
  const list: GuestbookReply[] = raw
    ? ((typeof raw === "string" ? JSON.parse(raw) : raw) as GuestbookReply[])
    : [];
  list.push(reply);
  await kv.hset(key, { [commentId]: JSON.stringify(list) });
}
