// One-time import from the Hexo source branch. Future writing lives here.
// No remote database writes: only public, approved Waline comments are saved.
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import matter from "gray-matter";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

const root = process.cwd();
const directory = path.join(root, "content/blog");
const assets = path.join(root, "public/assets/blog");
const repository = "itousouta15/itouBLoGa";
const sourceOrigin = "https://blog.itousouta.me";
const waline = "https://web-eight-weld-65.vercel.app";
const exists = (file) =>
  access(file).then(
    () => true,
    () => false
  );
const json = (file, value) =>
  writeFile(file, JSON.stringify(value, null, 2) + "\n");

async function request(url, format = "json", options = {}) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) throw new Error(`${response.status}: ${url}`);
      const result =
        format === "json"
          ? await response.json()
          : format === "buffer"
            ? Buffer.from(await response.arrayBuffer())
            : await response.text();
      if (format === "json" && result?.errno)
        throw new Error(`Waline ${result.errno}: ${url}`);
      return result;
    } catch (error) {
      if (attempt === 2) throw error;
      await new Promise((resolve) => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
}

function localImage(src) {
  return src.startsWith("/images/")
    ? "/assets/blog/originals/" + decodeURI(src.slice(8))
    : src;
}

export function normalizeBody(source) {
  // Reimu's one custom friend card becomes ordinary linked Markdown.
  let body = source.replace(
    /<div class="friend-item-wrap">[\s\S]*?<div class="friend-desc">([^<]*)<\/div>\s*<\/div>\s*<\/div>/g,
    (card, description) => {
      const href = card.match(/href="([^"]+)"/)?.[1] ?? "";
      const src = card.match(/\bsrc="([^"]+)"/)?.[1] ?? "";
      const name = card.match(/class="friend-name">([^<]*)/)?.[1] ?? "";
      return `\n[![${name}](${src} "avatar")](${href})\n\n[**${name}**](${href}) — ${description}\n`;
    }
  );
  body = body.replace(/<!--\s*more\s*-->/g, "");
  const aliases = {
    CPP: "cpp",
    "C++": "cpp",
    Python: "python",
    PHP: "php",
    pyhton: "python",
    txt: "text",
    danger: "text",
  };
  const languages = new Set([
    "",
    "cpp",
    "c",
    "python",
    "javascript",
    "js",
    "typescript",
    "ts",
    "bash",
    "sh",
    "shell",
    "powershell",
    "ps1",
    "yaml",
    "yml",
    "json",
    "html",
    "css",
    "php",
    "sql",
    "text",
    "mermaid",
  ]);
  let fence = null;
  const lines = body
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => {
      const match = line.match(/^\s*(`{3,}|~{3,})(.*)$/);
      if (match) {
        if (fence) {
          if (
            match[1][0] === fence[0] &&
            match[1].length >= fence.length &&
            !match[2].trim()
          )
            fence = null;
          return line;
        }
        fence = match[1];
        const info = match[2].trim();
        const token = info.split(/[\s=]/)[0];
        const language = aliases[token] ?? token.toLowerCase();
        const indent = line.match(/^\s*/)?.[0] ?? "";
        if (info && !languages.has(language))
          return indent + match[1] + "text\n" + info;
        const suffix = info.slice(token.length).replace(/^=/, "").trim();
        const meta = suffix
          ? ` title=${JSON.stringify(suffix)}`
          : info.endsWith("=")
            ? " showLineNumbers"
            : "";
        return indent + match[1] + language + meta;
      }
      if (fence) return line;
      if (/^\s*\\\[\s*$/.test(line) || /^\s*\\\]\s*$/.test(line)) return "$$";
      // C++ templates and CLI placeholders in prose are text, not HTML tags.
      return line
        .split(/(`+[^`]*`+)/)
        .map((part) =>
          part.startsWith("`")
            ? part
            : part
                .replace(
                  /(\[[^\]]*\]\()\/images\//g,
                  "$1/assets/blog/originals/"
                )
                .replace(
                  /\b(?:imagepng|getenv)\([^)]*\)/g,
                  (value) => "`" + value + "`"
                )
                .replace(
                  /\$_(?:ENV|GET|POST|SERVER|COOKIE|SESSION|REQUEST|FILES)\b/g,
                  (value) => "`" + value + "`"
                )
                .replace(
                  /\\\((.+?)\\\)/g,
                  (_match, formula) => "$" + formula + "$"
                )
                .replace(/<(?!https?:\/\/)([^<>\n]+)>/g, "`<$1>`")
        )
        .join("");
    });
  return lines.join("\n").trim() + "\n";
}

function dateValue(raw, parsed) {
  const value =
    raw.match(/^date:\s*([^\r\n]+)/m)?.[1]?.replace(/^["']|["']$/g, "") ??
    String(parsed);
  const normalized = value.replace(" ", "T");
  if (/^\d{4}-\d\d-\d\d$/.test(normalized))
    return normalized + "T00:00:00+08:00";
  return /(?:Z|[+-]\d\d:\d\d)$/.test(normalized)
    ? normalized
    : normalized + "+08:00";
}

const safeLink = (value) => {
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export async function readComments(legacyPath) {
  const records = new Map();
  let pages = 1;
  for (let page = 1; page <= pages; page++) {
    const query = new URLSearchParams({
      path: legacyPath,
      page: String(page),
      pageSize: "100",
      sortBy: "insertedAt_asc",
    });
    const response = await request(`${waline}/api/comment?${query}`, "json", {
      headers: { Origin: sourceOrigin, Referer: sourceOrigin + legacyPath },
    });
    if (!Array.isArray(response.data?.data))
      throw new Error("Invalid Waline response");
    pages = Math.max(1, response.data.totalPages ?? 1);
    const collect = (comment, rootId = null) => {
      if (comment.status && comment.status !== "approved") return;
      const id = `waline-${comment.objectId}`;
      const timestamp = new Date(comment.time).toISOString();
      records.set(id, {
        id,
        nick: String(comment.nick || "訪客"),
        text: String(comment.orig ?? ""),
        timestamp,
        avatar: safeLink(comment.avatar),
        link: safeLink(comment.link),
        source: "waline",
        ...(rootId
          ? {
              rootId,
              parentId: comment.pid ? `waline-${comment.pid}` : rootId,
              replyToNick: String(comment.at || ""),
            }
          : {}),
      });
      for (const child of comment.children ?? []) collect(child, rootId ?? id);
    };
    for (const comment of response.data.data) collect(comment);
  }
  const values = [...records.values()];
  return values
    .filter((entry) => !entry.rootId)
    .map((entry) => ({
      ...entry,
      replies: values
        .filter((reply) => reply.rootId === entry.id)
        .map(({ rootId: _root, ...reply }) => reply),
    }));
}

async function main() {
  if (await exists(path.join(directory, "migration.json")))
    throw new Error(
      "Blog already imported. Edit content/blog directly; the importer does not overwrite authored content."
    );
  await mkdir(directory, { recursive: true });
  await mkdir(path.join(assets, "originals"), { recursive: true });
  await mkdir(path.join(assets, "images"), { recursive: true });
  const headers = process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {};
  const tree = await request(
    `https://api.github.com/repos/${repository}/git/trees/source?recursive=1`,
    "json",
    { headers }
  );
  if (tree.truncated || !tree.sha)
    throw new Error("Incomplete source inventory");
  const revision = tree.sha;
  const raw = (file) =>
    `https://raw.githubusercontent.com/${repository}/${revision}/${encodeURI(file)}`;
  const files = tree.tree.filter(
    (file) =>
      file.type === "blob" &&
      file.path.startsWith("source/_posts/") &&
      file.path.endsWith(".md")
  );
  const all = [];
  for (let start = 0; start < files.length; start += 4) {
    all.push(
      ...(await Promise.all(
        files.slice(start, start + 4).map(async (file) => {
          const source = await request(raw(file.path), "text");
          return { file, source, ...matter(source) };
        })
      ))
    );
  }
  const atom = await request(sourceOrigin + "/atom.xml", "text");
  const legacy = new Map();
  for (const entry of atom.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = entry[1].match(/<id>([^<]+)<\/id>/)?.[1];
    if (id) {
      const url = new URL(id);
      legacy.set(
        decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1)),
        url.pathname
      );
    }
  }
  const selected = all.filter(
    ({ data }) => !data.lang || data.lang === "zh-TW"
  );
  const referenced = new Set();
  const manifests = [];
  const history = {};
  for (const post of selected) {
    const slug = String(post.data.urlname);
    if (!/^[A-Za-z0-9_-]+$/.test(slug) || !legacy.has(slug))
      throw new Error(`Missing slug/legacy URL: ${post.file.path}`);
    const file = path.join(directory, slug + ".md");
    if (await exists(file)) throw new Error(`Refusing to overwrite ${file}`);
    const legacyPath = legacy.get(slug);
    const translations = Object.fromEntries(
      all
        .filter(
          (item) =>
            item.data.urlname === slug && ["en", "ja"].includes(item.data.lang)
        )
        .map((item) => [
          item.data.lang,
          `${sourceOrigin}/${item.data.lang}${legacyPath}`,
        ])
    );
    const date = dateValue(post.source, post.data.date);
    const data = {
      title: post.data.title,
      slug,
      date,
      categories: post.data.categories ?? [],
      tags: post.data.tags ?? [],
      cover: localImage(String(post.data.cover ?? "")),
      pinned: new Date(date).getFullYear() > new Date().getFullYear(),
      legacyPath,
      translations,
      source: `https://github.com/${repository}/blob/${revision}/${encodeURI(post.file.path)}`,
    };
    const body = normalizeBody(post.content);
    if (data.cover.startsWith("/assets/blog/originals/"))
      referenced.add(data.cover);
    for (const match of body.matchAll(/!\[[^\]]*\]\(([^)\s]+)\)/g))
      if (match[1].startsWith("/assets/blog/originals/"))
        referenced.add(decodeURI(match[1]));
    await writeFile(file, matter.stringify(body, data));
    history[`/writing/${slug}`] = await readComments(legacyPath);
    manifests.push({
      slug,
      sourcePath: post.file.path,
      sourceSha: post.file.sha,
      legacyPath,
      translations,
    });
    console.log(
      `Imported ${slug}: ${history[`/writing/${slug}`].length} comment threads`
    );
  }
  const imageManifest = {};
  const imageList = [...referenced].sort();
  for (let start = 0; start < imageList.length; start += 3) {
    await Promise.all(
      imageList.slice(start, start + 3).map(async (src) => {
        const relative = src.slice("/assets/blog/originals/".length);
        if (relative.split("/").includes(".."))
          throw new Error("Invalid image path");
        const sourcePath = "source/images/" + relative;
        const sourceFile = tree.tree.find((file) => file.path === sourcePath);
        if (!sourceFile) throw new Error(`Missing image ${sourcePath}`);
        const output = path.join(assets, "originals", relative);
        let bytes;
        if (await exists(output)) bytes = await readFile(output);
        else {
          bytes = await request(raw(sourcePath), "buffer");
          const digest = createHash("sha1")
            .update(`blob ${bytes.length}\0`)
            .update(bytes)
            .digest("hex");
          if (digest !== sourceFile.sha)
            throw new Error(`Image integrity mismatch: ${relative}`);
          await mkdir(path.dirname(output), { recursive: true });
          await writeFile(output, bytes);
        }
        const metadata = await sharp(bytes, { animated: true }).metadata();
        const variants = [];
        const hash = createHash("sha256")
          .update(src)
          .digest("hex")
          .slice(0, 14);
        if (metadata.format !== "svg" && !(metadata.pages > 1)) {
          const widths = [
            ...new Set(
              [480, 960, 1600].map((width) => Math.min(width, metadata.width))
            ),
          ];
          for (const width of widths) {
            const name = `${hash}-${width}.webp`;
            const file = path.join(assets, "images", name);
            if (!(await exists(file)))
              await sharp(bytes)
                .rotate()
                .resize({ width, withoutEnlargement: true })
                .webp({ quality: 84 })
                .toFile(file);
            variants.push({ src: `/assets/blog/images/${name}`, width });
          }
        }
        imageManifest[src] = {
          width: metadata.width,
          height: metadata.height,
          variants,
        };
      })
    );
    console.log(
      `Images ${Math.min(start + 3, imageList.length)}/${imageList.length}`
    );
  }
  await json(path.join(directory, "images.json"), imageManifest);
  await json(path.join(directory, "legacy-comments.json"), history);
  await json(
    path.join(directory, "redirects.json"),
    manifests.map(({ slug, legacyPath }) => ({ slug, legacyPath }))
  );
  await json(path.join(directory, "migration.json"), {
    repository,
    revision,
    importedAt: new Date().toISOString(),
    posts: manifests,
    imageCount: imageList.length,
    commentCount: Object.values(history)
      .flat()
      .reduce((n, entry) => n + 1 + entry.replies.length, 0),
  });
  console.log(
    `Done: ${selected.length} posts, ${imageList.length} local images. Future articles: content/blog/*.md`
  );
}

if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await main();
