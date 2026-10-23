import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import images from "../../content/blog/images.json";
import { inspectMarkdown } from "./blogMarkdown";
import type { BlogPost, PostSummary } from "./postTypes";

const directory = path.join(process.cwd(), "content/blog");
const SLUG = /^[A-Za-z0-9_-]+$/;
const list = (value: unknown): string[] =>
  (Array.isArray(value) ? value : value ? [value] : []).filter(
    (item): item is string => typeof item === "string"
  );

export interface BlogImageData {
  width: number;
  height: number;
  variants: { src: string; width: number }[];
}
export function blogImage(src: string): BlogImageData | undefined {
  let key = src;
  try {
    key = decodeURI(src);
  } catch {
    /* An external URL need not be decoded. */
  }
  return (images as Record<string, BlogImageData>)[key];
}
export function blogImagePreview(src: string, width = 960): string {
  const variants = blogImage(src)?.variants ?? [];
  return (
    variants.find((item) => item.width >= width)?.src ??
    variants.at(-1)?.src ??
    src
  );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  if (!SLUG.test(slug)) return undefined;
  const filename = readdirSync(directory).find(
    (file) =>
      file.endsWith(".md") &&
      file.slice(0, -3).toLowerCase() === slug.toLowerCase()
  );
  if (!filename) return undefined;
  const { data, content } = matter(
    readFileSync(path.join(directory, filename), "utf8")
  );
  const canonical = filename.slice(0, -3);
  if (data.draft === true) return undefined;
  if (typeof data.title !== "string" || !data.title.trim())
    throw new Error(`Missing article title: ${filename}`);
  const rawDate =
    data.date instanceof Date
      ? data.date.toISOString()
      : String(data.date ?? "");
  const dateISO = /^\d{4}-\d\d-\d\d$/.test(rawDate)
    ? rawDate + "T00:00:00+08:00"
    : rawDate;
  const timestamp = Date.parse(dateISO);
  if (!Number.isFinite(timestamp))
    throw new Error(`Invalid article date: ${filename}`);
  const inspected = inspectMarkdown(content);
  const originalCover = typeof data.cover === "string" ? data.cover : "";
  return {
    slug: canonical,
    path: `/writing/${canonical}`,
    title: data.title.trim(),
    date: new Intl.DateTimeFormat("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Taipei",
    }).format(timestamp),
    dateISO,
    timestamp,
    updated:
      typeof data.updated === "string" &&
      Number.isFinite(Date.parse(data.updated))
        ? data.updated
        : undefined,
    categories: list(data.categories ?? data.category),
    tags: list(data.tags),
    description:
      typeof data.description === "string"
        ? data.description
        : inspected.description,
    cover: blogImagePreview(originalCover),
    coverWidth: blogImage(originalCover)?.width,
    coverHeight: blogImage(originalCover)?.height,
    originalCover,
    pinned: data.pinned === true,
    wordCount: inspected.wordCount,
    readingMinutes: inspected.readingMinutes,
    searchText:
      data.searchCode === false ? inspected.plainText : inspected.searchText,
    prefetch: data.prefetch === false ? false : undefined,
    headings: inspected.headings,
    translations: Object.fromEntries(
      Object.entries(data.translations ?? {}).filter(
        ([locale, url]) =>
          ["en", "ja"].includes(locale) &&
          typeof url === "string" &&
          /^https:\/\/blog\.itousouta\.me\/(en|ja)\//.test(url)
      )
    ),
    legacyPath:
      typeof data.legacyPath === "string" ? data.legacyPath : undefined,
    plainCode: data.plainCode === true,
    content,
  };
}

export function getAllPosts(): BlogPost[] {
  return readdirSync(directory)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) => {
      const post = getPostBySlug(file.slice(0, -3));
      return post ? [post] : [];
    })
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.timestamp - a.timestamp ||
        a.slug.localeCompare(b.slug)
    );
}

export function getPostSummaries(): PostSummary[] {
  return getAllPosts().map(
    ({
      content: _content,
      headings: _headings,
      originalCover,
      plainCode: _plainCode,
      ...summary
    }) => ({ ...summary, cover: blogImagePreview(originalCover, 480) })
  );
}

/** A future-dated post does not become the latest RSS date. */
export function getPublishedPosts(): BlogPost[] {
  return getAllPosts()
    .filter((post) => post.timestamp <= Date.now())
    .sort((a, b) => b.timestamp - a.timestamp);
}
