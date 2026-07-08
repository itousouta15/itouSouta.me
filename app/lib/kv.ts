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
