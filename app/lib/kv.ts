import { kv } from "@vercel/kv";

export interface KVThought {
  id: string;
  text: string;
  timestamp: string;
}

const KEY = "thoughts";

export async function saveThought(text: string): Promise<void> {
  const entry: KVThought = {
    id: crypto.randomUUID(),
    text,
    timestamp: new Date().toISOString(),
  };
  await kv.lpush(KEY, JSON.stringify(entry));
}

export async function getThoughts(): Promise<KVThought[]> {
  const raw = await kv.lrange<string>(KEY, 0, 49);
  return raw.map((r) => (typeof r === "string" ? JSON.parse(r) : r));
}
