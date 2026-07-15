import { kv } from "@vercel/kv";

const KEY = "visitor_count";

export async function incrementVisitorCount(): Promise<number> {
  return kv.incr(KEY);
}
