import archive from "../../content/blog/legacy-comments.json";
import type { GuestbookEntry, GuestbookReply } from "./kv";
import { avatarThumb } from "./imageThumb";

export interface LegacyEntry extends GuestbookEntry {
  replies: GuestbookReply[];
}

export function legacyCommentText(text: string): string {
  return text
    .replace(/<img\b[^>]*class="wl-emoji"[^>]*>/gi, (tag) => {
      const alt = tag.match(/alt="([^"]+)"/)?.[1] ?? "";
      if (/^[a-f\d]+(?:-[a-f\d]+)*$/i.test(alt)) {
        const points = alt.split("-").map((value) => parseInt(value, 16));
        if (points.every((value) => value <= 0x10ffff))
          return String.fromCodePoint(...points);
      }
      return alt;
    })
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/\]\(#([a-f\d]{24})\)/gi, "](#gb-waline-$1)");
}

export function getLegacyComments(pagePath: string): LegacyEntry[] {
  const entries = (archive as Record<string, LegacyEntry[]>)[pagePath] ?? [];
  return entries.map((entry) => {
    const replies = entry.replies ?? [];
    const names = new Map(
      [entry, ...replies].map((item) => [item.id, item.nick])
    );
    return {
      ...entry,
      text: legacyCommentText(entry.text),
      avatar: entry.avatar ? avatarThumb(entry.avatar) : null,
      replies: replies.map((reply) => ({
        ...reply,
        text: legacyCommentText(reply.text).replace(
          /^\[@[^\]]+\]\(#[^)]+\):\s*/,
          ""
        ),
        avatar: reply.avatar ? avatarThumb(reply.avatar) : null,
        replyToNick:
          names.get(reply.parentId) ??
          reply.text.match(/^\[@([^\]]+)\]/)?.[1] ??
          entry.nick,
      })),
    };
  });
}

export function mergeGuestbookHistory(
  pagePath: string,
  entries: GuestbookEntry[],
  replies: Record<string, GuestbookReply[]>
): LegacyEntry[] {
  const legacy = getLegacyComments(pagePath);
  const roots = new Map<string, LegacyEntry>(
    legacy.map((entry) => [entry.id, entry])
  );
  for (const entry of entries)
    roots.set(entry.id, {
      ...entry,
      replies: roots.get(entry.id)?.replies ?? [],
    });
  return [...roots.values()]
    .map((entry) => {
      const combined = new Map(entry.replies.map((reply) => [reply.id, reply]));
      for (const reply of replies[entry.id] ?? [])
        combined.set(reply.id, reply);
      return {
        ...entry,
        replies: [...combined.values()].sort(
          (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp)
        ),
      };
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}
