const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
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
const { unavailable } = require("../app/template/availability.ts");

test("sample post can be replaced without changing route or summary code", () => {
  const posts = getAllPosts();
  assert.deepEqual(
    posts.map(({ slug }) => slug),
    ["welcome"]
  );
  assert.ok(getPostBySlug("WELCOME").content.includes("# 你好"));
  assert.equal(getPostBySlug("welcome").path, "/writing/welcome");
  assert.ok(
    getPublishedPosts().every(({ timestamp }) => timestamp <= Date.now())
  );
  const summary = getPostSummaries()[0];
  assert.ok(!("content" in summary) && !("headings" in summary));
  assert.ok(summary.searchText.includes("網站"));
  for (const slug of ["../welcome", "welcome/", "%2fetc", "missing"])
    assert.equal(getPostBySlug(slug), undefined);
});

test("article Markdown headings share their table-of-contents IDs", () => {
  const markdown =
    "# 標題\n\n## 一樣\n\n## 一樣\n\n中文與 English\n\n```cpp\n# Not a heading\nvery_unique_code_keyword\n```";
  const result = inspectMarkdown(markdown);
  assert.deepEqual(
    result.headings.map(({ depth }) => depth),
    [2, 3, 3]
  );
  assert.equal(result.headings[2].id, `${result.headings[1].id}-1`);
  assert.ok(result.searchText.includes("very_unique_code_keyword"));
  assert.ok(!result.plainText.includes("very_unique_code_keyword"));
  const { unified } = require("unified");
  const tree = unified().use(require("remark-parse").default).parse(markdown);
  remarkArticleHeadings()(tree);
  assert.deepEqual(
    tree.children
      .filter(({ type }) => type === "heading")
      .map(({ data }) => data.hProperties.id),
    result.headings.map(({ id }) => id)
  );
});

test("generic template has no imported article images or historical comments", () => {
  assert.equal(blogImage("/assets/template/banner.svg"), undefined);
  assert.deepEqual(getLegacyComments("/writing/welcome"), []);
  assert.deepEqual(mergeGuestbookHistory("/writing/welcome", [], {}), []);
  assert.equal(
    legacyCommentText(
      '<img class="wl-emoji" src="https://example.com" alt="1f917">'
    ),
    "🤗"
  );
});

test("unused integrations are unavailable by default", () => {
  for (const name of [
    "guestbook",
    "impressions",
    "reactions",
    "github",
    "discord",
    "spotify",
    "vtuberLive",
  ])
    assert.equal(unavailable(name).status, 404, name);
});

test("disabled API routes reject requests before contacting an upstream service", async () => {
  const { NextRequest } = require("next/server");
  const guestbook = require("../app/api/guestbook/route.ts");
  const nowPlaying = require("../app/api/now-playing/route.ts");
  const vtuberLive = require("../app/api/vtuber-live/route.ts");
  assert.equal(
    (await guestbook.GET(new NextRequest("https://example.com/api/guestbook")))
      .status,
    404
  );
  assert.equal(
    (
      await guestbook.POST(
        new NextRequest("https://example.com/api/guestbook", { method: "POST" })
      )
    ).status,
    404
  );
  assert.equal(
    (await nowPlaying.GET(new Request("https://example.com/api/now-playing")))
      .status,
    404
  );
  assert.equal((await vtuberLive.GET()).status, 404);
});

test("chapter links and table-of-contents boundaries still work", () => {
  assert.equal(chapterBackLink("/writing/welcome").href, "/writing");
  assert.equal(chapterBackLink("/projects/my-first-project").href, "/projects");
  assert.equal(chapterBackLink("/likes/music").href, "/likes");
  const positions = [
    { id: "intro", top: 200 },
    { id: "code", top: 700 },
  ];
  assert.equal(activeHeadingAt(positions, 699), "intro");
  assert.equal(activeHeadingAt(positions, 700), "code");
});

test("deferred C++ highlighting preserves copyable source", () => {
  const source =
    '#include <iostream>\nint main() {\n  // comment\n  cout << "https://example.com";\n  return 42;\n}\n';
  const tokens = tokenizeCpp(source);
  assert.equal(tokens.map(({ text }) => text).join(""), source);
  assert.ok(tokens.some(({ kind }) => kind === "comment"));
  assert.ok(tokens.some(({ kind }) => kind === "directive"));
});
