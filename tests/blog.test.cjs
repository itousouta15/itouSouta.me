const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const {
  getAllPosts,
  getPostBySlug,
  getPostSummaries,
  getPublishedPosts,
  blogImage,
} = require("../app/lib/posts.ts");
const {
  inspectMarkdown,
  remarkArticleHeadings,
} = require("../app/lib/blogMarkdown.ts");
const {
  getLegacyComments,
  legacyCommentText,
  mergeGuestbookHistory,
} = require("../app/lib/legacyComments.ts");
const { chapterBackLink } = require("../app/lib/navigation.ts");
const { activeHeadingAt } = require("../app/lib/toc.ts");
const { tokenizeCpp } = require("../app/components/writing/cppHighlight.ts");
const migration = require("../content/blog/migration.json");
const redirects = require("../content/blog/redirects.json");
const images = require("../content/blog/images.json");
const history = require("../content/blog/legacy-comments.json");

test("migrated posts load with canonical paths and summaries", () => {
  const posts = getAllPosts();
  assert.equal(new Set(posts.map(({ slug }) => slug)).size, posts.length);
  for (const imported of migration.posts) {
    const post = posts.find(({ slug }) => slug === imported.slug);
    assert.ok(post?.content.trim(), imported.slug);
    assert.equal(post.path, `/writing/${imported.slug}`);
    assert.ok(post.readingMinutes >= 1);
    assert.ok(post.wordCount > 0);
    assert.equal(
      new Set(post.headings.map(({ id }) => id)).size,
      post.headings.length
    );
  }
  assert.equal(getPostBySlug("FIRSTBLOG").slug, "firstblog");
  assert.ok(getPostBySlug("firstblog").content.includes("# C++到前端"));
  assert.ok(
    getPostBySlug("AIS3PE").headings.some(({ text }) => text === "前言")
  );
  assert.ok(
    getPublishedPosts().every(({ timestamp }) => timestamp <= Date.now())
  );
  const summary = getPostSummaries().find(({ slug }) => slug === "firstblog");
  assert.ok(!("content" in summary) && !("headings" in summary));
  assert.ok(summary.searchText.includes("網站"));
  for (const slug of ["../firstblog", "firstblog/", "%2fetc", "missing"])
    assert.equal(getPostBySlug(slug), undefined);
});

test("unlisted writeup is reachable directly without appearing in public discovery", () => {
  const post = getPostBySlug("THJCC2026");
  assert.equal(post.path, "/writing/THJCC2026");
  assert.equal(post.unlisted, true);
  assert.ok(post.content.includes("## Crypto"));
  assert.ok(getAllPosts(true).some(({ slug }) => slug === post.slug));
  assert.ok(!getAllPosts().some(({ slug }) => slug === post.slug));
  assert.ok(!getPostSummaries().some(({ slug }) => slug === post.slug));
  assert.ok(!getPublishedPosts().some(({ slug }) => slug === post.slug));
});

test("article dates use Taipei while published legacy paths keep their actual old dates", () => {
  const first = getPostBySlug("firstblog");
  assert.equal(first.date, "2025/04/04");
  assert.equal(first.timestamp, Date.parse("2025-04-04T18:29:32+08:00"));
  const fh = getPostBySlug("FhCTF");
  assert.equal(fh.date, "2026/01/01");
  assert.equal(
    redirects.find(({ slug }) => slug === "FhCTF").legacyPath,
    "/2025/12/31/FhCTF/"
  );
  assert.equal(
    redirects.find(({ slug }) => slug === "APCS202510").legacyPath,
    "/2026/06/03/APCS202510/"
  );
  assert.ok(getPostBySlug("0ping67676767").timestamp > Date.now());
  assert.ok(!getPublishedPosts().some((post) => post.slug === "0ping67676767"));
  assert.ok(getPublishedPosts().every((post) => post.timestamp <= Date.now()));
});

test("slugs reject paths and support canonical case without making phantom articles", () => {
  for (const slug of [
    "../firstblog",
    "..",
    "firstblog/",
    "%2fetc",
    "not-a-post",
  ])
    assert.equal(getPostBySlug(slug), undefined);
  assert.equal(getPostBySlug("fhctf").slug, "FhCTF");
});

test("headings use AST IDs, skip code and preserve reading/search distinctions", () => {
  const markdown =
    "# 標題\n\n## 一樣\n\n## 一樣\n\n中文與 English\n\n```cpp\n# Not a heading\nvery_unique_code_keyword\n```";
  const result = inspectMarkdown(markdown);
  assert.deepEqual(
    result.headings.map((heading) => heading.depth),
    [2, 3, 3]
  );
  assert.equal(result.headings[2].id, result.headings[1].id + "-1");
  assert.ok(result.searchText.includes("very_unique_code_keyword"));
  assert.ok(!result.plainText.includes("very_unique_code_keyword"));
  const { unified } = require("unified");
  const parse = require("remark-parse").default;
  const tree = unified().use(parse).parse(markdown);
  remarkArticleHeadings()(tree);
  assert.deepEqual(
    tree.children
      .filter((node) => node.type === "heading")
      .map((node) => node.data.hProperties.id),
    result.headings.map((heading) => heading.id)
  );
});

test("all referenced local article images and their responsive variants exist", () => {
  assert.equal(Object.keys(images).length, migration.imageCount);
  for (const [src, image] of Object.entries(images)) {
    assert.ok(image.width > 0 && image.height > 0);
    assert.ok(existsSync(path.join(process.cwd(), "public", src)), src);
    for (const variant of image.variants)
      assert.ok(
        existsSync(path.join(process.cwd(), "public", variant.src)),
        variant.src
      );
  }
  const { unified } = require("unified");
  const parse = require("remark-parse").default;
  const { visit } = require("unist-util-visit");
  for (const { slug } of migration.posts) {
    const post = getPostBySlug(slug);
    assert.ok(blogImage(post.originalCover), slug);
    visit(unified().use(parse).parse(post.content), "image", (node) => {
      if (node.url.startsWith("/assets/blog/"))
        assert.ok(blogImage(node.url), node.url);
    });
  }
});

test("migration normalizer rewrites image links but leaves code and payload paths intact", async () => {
  const { normalizeBody } = await import("../scripts/import-blog.mjs");
  const source =
    '![photo](/images/photo.webp)\n\n```CPP\nconst char* path = "/images/payload.php";\n```\n\n`/images/example.webp`\n\nmap <string, int>\n\n<!-- more -->';
  const normalized = normalizeBody(source);
  assert.ok(
    normalized.includes("!\u005bphoto](/assets/blog/originals/photo.webp)")
  );
  assert.ok(normalized.includes('const char* path = "/images/payload.php";'));
  assert.ok(normalized.includes("`/images/example.webp`"));
  assert.ok(normalized.includes("```cpp"));
  assert.ok(normalized.includes("`<string, int>`"));
  assert.ok(!normalized.includes("<!-- more -->"));
});

test("historical public comments preserve threads without private metadata or duplicate roots", () => {
  let total = 0;
  for (const [pagePath, entries] of Object.entries(history)) {
    const all = entries.flatMap((entry) => [entry, ...entry.replies]);
    total += all.length;
    for (const entry of all)
      for (const key of ["mail", "email", "ip", "addr", "browser", "os", "ua"])
        assert.ok(!(key in entry), key);
    const visible = getLegacyComments(pagePath);
    assert.equal(visible.length, entries.length);
    const merged = mergeGuestbookHistory(pagePath, visible, {});
    assert.equal(merged.length, entries.length);
  }
  assert.equal(total, migration.commentCount);
  const pagePath = "/writing/firstblog";
  const root = getLegacyComments(pagePath)[0];
  const reply = {
    id: "new-reply",
    nick: "新訪客",
    text: "新回覆",
    timestamp: new Date().toISOString(),
    parentId: root.id,
    replyToNick: root.nick,
  };
  const merged = mergeGuestbookHistory(pagePath, [], { [root.id]: [reply] });
  assert.ok(
    merged
      .find((entry) => entry.id === root.id)
      .replies.some((item) => item.id === reply.id)
  );
  assert.equal(
    legacyCommentText(
      '<img class="wl-emoji" src="https://example.com" alt="1f917">'
    ),
    "🤗"
  );
  assert.deepEqual(getLegacyComments("/writing/not-a-post"), []);
});

test("nested chapter links go to their section and top-level pages go home", () => {
  for (const [pathname, href] of [
    ["/writing/FhCTF", "/writing"],
    ["/projects/itoumd", "/projects"],
    ["/likes/music", "/likes"],
    ["/writing", "/"],
    ["/links", "/"],
  ])
    assert.equal(chapterBackLink(pathname).href, href);
});

test("TOC current section follows measured heading boundaries and large scroll jumps", () => {
  const positions = [
    { id: "intro", top: 200 },
    { id: "code", top: 700 },
    { id: "conclusion", top: 4000 },
  ];
  assert.equal(activeHeadingAt([], 0), null);
  assert.equal(activeHeadingAt(positions, 0), "intro");
  assert.equal(activeHeadingAt(positions, 699), "intro");
  assert.equal(activeHeadingAt(positions, 700), "code");
  assert.equal(activeHeadingAt(positions, 3999), "code");
  assert.equal(activeHeadingAt(positions, 9000), "conclusion");
  assert.equal(activeHeadingAt(positions, 350), "intro");
  assert.deepEqual(
    positions.map((item) => item.top),
    [200, 700, 4000]
  );
});

test("itouOJ is one searchable article without indexing every code block", () => {
  const post = getPostBySlug("itouOJ");
  assert.ok(post);
  assert.equal(post.deferredHighlight, true);
  const ids = post.headings.map((heading) => heading.text.slice(0, 5));
  const expected = Array.from({ length: 85 }, (_, index) => {
    return `a${String(index + 1).padStart(3, "0")}.`;
  });
  assert.deepEqual(ids, expected);
  const summary = getPostSummaries().find((item) => item.slug === "itouOJ");
  assert.ok(summary.searchText.includes("a085"));
  assert.ok(!summary.searchText.includes("#include"));
  assert.equal(summary.prefetch, false);
});

test("deferred C++ highlighting colors tokens without changing copied source", () => {
  const source = [
    "#include <iostream>",
    "int main() {",
    "  // comment",
    '  cout << "https://example.com";',
    "  return 42;",
    "}",
    "",
  ].join("\n");
  const tokens = tokenizeCpp(source);
  assert.equal(tokens.map((token) => token.text).join(""), source);
  for (const [text, kind] of [
    ["#include <iostream>", "directive"],
    ["int", "type"],
    ["main", "function"],
    ["// comment", "comment"],
    ['"https://example.com"', "string"],
    ["return", "keyword"],
    ["42", "number"],
  ]) {
    assert.ok(
      tokens.some((token) => token.text.trim() === text && token.kind === kind)
    );
  }
});

test("redirect manifest targets only the migrated Chinese article paths", async () => {
  const config = (await import("../next.config.mjs")).default;
  const routes = await config.redirects();
  for (const post of redirects)
    assert.ok(
      routes.some(
        (route) =>
          route.source === post.legacyPath.replace(/\/$/, "") &&
          route.destination === `/writing/${post.slug}`
      )
    );
  assert.ok(
    routes.every(
      (route) =>
        !route.source.startsWith("/en/") && !route.source.startsWith("/ja/")
    )
  );
});

test("guestbook API serves history on KV failure and accepts replies to a historical parent", async () => {
  const kv = require("../app/lib/kv.ts");
  const notify = require("../app/lib/notify.ts");
  const originals = Object.fromEntries(
    [
      "rateLimit",
      "getGuestbookEntries",
      "getGuestbookReplies",
      "findGuestbookEntryRaw",
      "getRepliesForComment",
      "addGuestbookReply",
    ].map((key) => [key, kv[key]])
  );
  const originalNotify = notify.sendReplyNotification;
  try {
    let saved;
    kv.rateLimit = async () => true;
    kv.getGuestbookEntries = async () => {
      throw new Error("offline");
    };
    kv.getGuestbookReplies = async () => ({});
    kv.findGuestbookEntryRaw = async () => null;
    kv.getRepliesForComment = async () => [];
    kv.addGuestbookReply = async (pagePath, id, reply) => {
      saved = { pagePath, id, reply };
    };
    notify.sendReplyNotification = async () => {};
    const { NextRequest } = require("next/server");
    const route = require("../app/api/guestbook/route.ts");
    const response = await route.GET(
      new NextRequest("http://localhost/api/guestbook?path=/writing/firstblog")
    );
    const body = await response.json();
    assert.equal(response.status, 200);
    assert.equal(body.readOnly, true);
    const root = body.entries[0];
    const reply = await route.POST(
      new NextRequest("http://localhost/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/writing/firstblog",
          commentId: root.id,
          parentId: root.id,
          nick: "測試訪客",
          text: "回覆舊留言",
        }),
      })
    );
    assert.equal(reply.status, 200);
    assert.equal(saved.id, root.id);
    assert.equal(saved.reply.parentId, root.id);
    assert.equal(saved.pagePath, "/writing/firstblog");
  } finally {
    for (const [key, value] of Object.entries(originals)) kv[key] = value;
    notify.sendReplyNotification = originalNotify;
  }
});
