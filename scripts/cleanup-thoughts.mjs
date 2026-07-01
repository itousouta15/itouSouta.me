// Remove all "thoughts" KV entries whose text exactly matches the given argument.
// Usage: node --env-file=.env.local scripts/cleanup-thoughts.mjs "來自伊藤園喵"

import { kv } from "@vercel/kv";

const target = process.argv[2];
if (!target) {
  console.error("用法: node --env-file=.env.local scripts/cleanup-thoughts.mjs \"要刪除的內容\"");
  process.exit(1);
}

const KEY = "thoughts";
const raw = await kv.lrange(KEY, 0, -1);

let removed = 0;
for (const entry of raw) {
  const parsed = typeof entry === "string" ? JSON.parse(entry) : entry;
  if (parsed.text === target) {
    const count = await kv.lrem(KEY, 0, entry);
    removed += count;
  }
}

console.log(`✓ 已刪除 ${removed} 筆內容為「${target}」的資料`);
