const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Use the project's compiler so these tests also run on CI's Node 20.
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
    fileName: filename,
  });
  module._compile(outputText, filename);
};
const fromApp = (file) => require(path.join("..", "app", file));
const { readContributionDays, contributionCells } = fromApp(
  "lib/contributions.ts"
);
const { createContributionRoute } = fromApp("lib/contributionSnake.ts");
const { PROJECTS } = fromApp("data/projects.ts");
const { findProject, projectPath, projectSearchPath, matchesProject } = fromApp(
  "lib/projectRoutes.ts"
);
const { nextChapter } = fromApp("lib/navigation.ts");
const { getProjectScreenshots } = fromApp("lib/projectGallery.ts");
const { layoutImpressionCloud } = fromApp("lib/impressionCloud.ts");

test("contribution validation rejects impossible dates, duplicate/missing days, and invalid counts", () => {
  const day = { date: "2026-01-01", count: 4, level: 2 };
  assert.deepEqual(readContributionDays({ contributions: [day] }), [day]);
  for (const contributions of [
    [],
    [day, day],
    [{ ...day, date: "2026-02-30" }],
    [{ ...day, count: -1 }],
    [{ ...day, level: 5 }],
    [day, { ...day, date: "2026-01-03" }],
  ]) {
    assert.throws(() => readContributionDays({ contributions }));
  }
  assert.deepEqual(
    contributionCells([day]).map(({ x, y }) => [x, y]),
    [[0, 4]]
  );
});

test("snake visits all contributions without collisions and joins seamlessly across loops", () => {
  const key = (p) => `${p.x},${p.y}`;
  const layouts = [[], [{ x: 0, y: 0, count: 1 }], [{ x: 52, y: 6, count: 1 }]];
  for (let seed = 1; seed <= 24; seed++) {
    let state = seed;
    const cells = [];
    for (let x = 0; x < 53; x++)
      for (let y = 0; y < 7; y++) {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        cells.push({
          x,
          y,
          count: seed === 24 || state % 5 === 0 ? 1 + (state % 30) : 0,
        });
      }
    layouts.push(cells);
  }
  for (const cells of layouts) {
    const { points, visits } = createContributionRoute(cells);
    const food = cells.filter((c) => c.count > 0);
    assert.equal(visits.size, food.length);
    if (!food.length) {
      assert.equal(points.length, 0);
      continue;
    }
    assert.deepEqual(points[0], points.at(-1));
    for (const cell of food)
      assert.equal(key(points[visits.get(key(cell))]), key(cell));
    const start = points[0];
    let body = [start, ...[1, 2, 3].map((n) => ({ x: start.x - n, y: -1 }))];
    for (let loop = 0; loop < 2; loop++)
      for (const point of points.slice(1)) {
        assert.equal(
          Math.abs(point.x - body[0].x) + Math.abs(point.y - body[0].y),
          1
        );
        assert.ok(
          !body.slice(0, -1).some((p) => key(p) === key(point)),
          "snake hit its body"
        );
        body = [point, ...body.slice(0, 3)];
      }
  }
});

test("project routes are unique, resolve legacy links, and retain Unicode searches", () => {
  assert.equal(new Set(PROJECTS.map((p) => p.slug)).size, PROJECTS.length);
  for (const project of PROJECTS) {
    assert.match(project.slug, /^[a-z0-9.-]+$/);
    assert.equal(findProject(project.slug), project);
    assert.equal(projectPath(project), `/projects/${project.slug}`);
  }
  for (const [legacy, canonical] of [
    ["THJCC Website", "thjcc-website"],
    ["https://west.nchusdsc.org/", "west-link-tree"],
    ["itouOJ 收件程式", "itouoj-submitter"],
    ["itouSandBox", "itousandbox"],
  ]) {
    // Removed projects should resolve to undefined rather than a phantom page.
    assert.equal(
      findProject(legacy),
      PROJECTS.find((p) => p.slug === canonical)
    );
  }
  assert.equal(findProject("not-a-project"), undefined);
  const query = "喵++ C++ & WebAssembly";
  assert.equal(
    new URL(projectSearchPath(query), "https://example.com").searchParams.get(
      "q"
    ),
    query
  );
});

test("project searches match multiple terms across technologies and story content", () => {
  const project = findProject("meow-plus-plus");
  assert.ok(matchesProject(project, "C++ webassembly"));
  assert.ok(matchesProject(project, "  單步   閉包  "));
  assert.ok(matchesProject(project, ""));
  assert.ok(!matchesProject(project, "Flutter WebAssembly"));
});

test("project stories use one Markdown field and keep both introduction and difficulties searchable", () => {
  for (const project of PROJECTS) {
    assert.ok(project.content?.trim(), `missing content: ${project.slug}`);
    for (const field of ["why", "longDesc", "difficulties"])
      assert.ok(!(field in project));
  }
  const project = findProject("itoumd");
  assert.match(project.content, /## 專案介紹/);
  assert.match(project.content, /## 遇到的困難/);
  assert.ok(matchesProject(project, "HackMD 長文件"));
  assert.ok(project.screenshots.length >= 1);
});

test("chapter links inherit only valid parent routes and stop at the final chapter", () => {
  assert.equal(nextChapter("/about").href, "/likes");
  assert.equal(nextChapter("/likes/music").href, "/projects");
  assert.equal(nextChapter("/projects/itoumd").href, "/writing");
  for (const pathname of [
    "/",
    "/experience",
    "/api",
    "/projects-extra",
    "/missing",
  ])
    assert.equal(nextChapter(pathname), undefined);
});

test("project galleries preserve cover-only projects and normalize additional screenshots", () => {
  const project = { title: "Gallery", cover: "/cover.webp" };
  assert.deepEqual(getProjectScreenshots(project), [
    { src: "/cover.webp", alt: "Gallery 預覽圖" },
  ]);
  const images = getProjectScreenshots({
    ...project,
    screenshots: [
      { src: "/cover.webp", alt: "duplicate cover" },
      { src: " ", alt: "blank path" },
      { src: " /detail.webp ", alt: "Detail", caption: "Feature screen" },
      { src: "/detail.webp", alt: "duplicate detail" },
    ],
  });
  assert.deepEqual(images, [
    { src: "/cover.webp", alt: "Gallery 預覽圖" },
    { src: "/detail.webp", alt: "Detail", caption: "Feature screen" },
  ]);
  assert.equal(getProjectScreenshots(findProject("itouoj")).length, 2);
});

test("music snapshots preserve Spotify's ranking and handle unavailable data without play-history fields", async () => {
  const spotify = fromApp("lib/spotify.ts");
  const { getMusicSnapshot } = fromApp("lib/music.ts");
  const original = spotify.getTopTracks;
  const tracks = [
    {
      id: "first",
      title: "First",
      artist: "Artist A",
      cover: "/first.webp",
      href: "https://open.spotify.com/track/first",
    },
    {
      id: "second",
      title: "Second",
      artist: "Artist B",
      cover: "/second.webp",
      href: "https://open.spotify.com/track/second",
    },
  ];
  try {
    spotify.getTopTracks = async () => tracks;
    assert.deepEqual(await getMusicSnapshot(), {
      tracks: tracks.map((track, index) => ({ ...track, rank: index + 1 })),
    });
    spotify.getTopTracks = async () => null;
    assert.deepEqual(await getMusicSnapshot(), { tracks: [] });
  } finally {
    spotify.getTopTracks = original;
  }
});

test("compact impression clouds stay in bounds, keep the latest word, and do not overlap rotated text", () => {
  const measure = (text, size) =>
    Array.from(text).reduce(
      (width, char) => width + (/[^\x00-\x7f]/.test(char) ? 1 : 0.6) * size,
      0
    );
  const tags = [
    "電神",
    "有想法",
    "喜歡音樂",
    "開源",
    "會寫程式",
    "好人",
    "路過",
    "想睡覺",
    "畫畫",
    "TypeScript",
    "VOCALOID",
    "喵",
    "有耐心",
    "網站好看",
    "學習中",
    "很有趣",
    "新朋友",
    "熱愛分享",
    "保持好奇",
    "歡迎來玩",
  ];
  const items = tags.map((tag, i) => ({ tag, count: i < 5 ? 25 - i * 4 : 1 }));
  const before = JSON.stringify(items);
  const cross = (a, b, c) =>
    (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  const inside = (point, polygon) =>
    polygon.every((a, i) => cross(a, polygon[(i + 1) % 4], point) > 0.0001);
  const corners = (word) => {
    const radians = (word.angle * Math.PI) / 180;
    const w = measure(word.tag, word.size) / 2;
    const h = (word.size * 1.1) / 2;
    return [
      [-w, -h],
      [w, -h],
      [w, h],
      [-w, h],
    ].map(([x, y]) => [
      word.x + x * Math.cos(radians) - y * Math.sin(radians),
      word.y + x * Math.sin(radians) + y * Math.cos(radians),
    ]);
  };
  const intersects = (a, b) => {
    if (a.some((p) => inside(p, b)) || b.some((p) => inside(p, a))) return true;
    for (let i = 0; i < 4; i++)
      for (let j = 0; j < 4; j++) {
        const p = a[i],
          q = a[(i + 1) % 4],
          r = b[j],
          s = b[(j + 1) % 4];
        if (
          cross(p, q, r) * cross(p, q, s) < -0.0001 &&
          cross(r, s, p) * cross(r, s, q) < -0.0001
        )
          return true;
      }
    return false;
  };
  for (const width of [280, 360, 712])
    for (const seed of [1, 42, 9876]) {
      const result = layoutImpressionCloud(
        items,
        width,
        180,
        seed,
        measure,
        "歡迎來玩"
      );
      assert.ok(result.length > 1);
      assert.ok(result.some((word) => word.tag === "歡迎來玩"));
      assert.deepEqual(
        result,
        layoutImpressionCloud(items, width, 180, seed, measure, "歡迎來玩")
      );
      const polygons = result.map(corners);
      for (let i = 0; i < result.length; i++) {
        assert.ok(result[i].size > 0 && result[i].size <= 46);
        assert.ok(result[i].color >= 0 && result[i].color < 4);
        for (const [x, y] of polygons[i])
          assert.ok(x >= 0 && x <= width && y >= 0 && y <= 180);
        for (let j = 0; j < i; j++) {
          assert.ok(!inside([result[i].x, result[i].y], polygons[j]));
          assert.ok(
            !intersects(polygons[i], polygons[j]),
            `${result[i].tag} overlaps ${result[j].tag}`
          );
        }
      }
    }
  assert.equal(JSON.stringify(items), before);
  assert.deepEqual(layoutImpressionCloud(items, 0, 180, 1, measure, null), []);
  assert.deepEqual(layoutImpressionCloud([], 712, 180, 1, measure, null), []);
});
