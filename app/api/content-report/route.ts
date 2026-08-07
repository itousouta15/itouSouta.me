import { LIKE_CATEGORIES, PROJECTS, type Project } from "../../data";

/* 開發用的填寫進度表：哪些專案還沒寫 why / longDesc / difficulties / timeline，
   哪些分類的 note 還是空的。跑 `npm run dev` 開 /api/content-report 就看得到。

   做成 route 而不是 scripts/*.mjs 的原因：data.ts 是 TypeScript，純 Node 腳本要嘛
   得靠 --experimental-strip-types（Node ≥22.6，CI 的 20 沒有）、要嘛多裝一個 tsx、
   要嘛用脆弱的 regex 硬解。route 直接 import，永遠不會跟型別脫節，零依賴。 */

export const dynamic = "force-dynamic";

const PROJECT_FIELDS = [
  "siteUrl",
  "demoUrl",
  "why",
  "longDesc",
  "difficulties",
  "timeline",
] as const;

function filled(p: Project, key: (typeof PROJECT_FIELDS)[number]): boolean {
  const v = p[key];
  return Array.isArray(v) ? v.length > 0 : v != null && v !== "";
}

function pad(s: string, width: number) {
  return s + " ".repeat(Math.max(0, width - s.length));
}

function projectTable(): string {
  const slugWidth = Math.max(...PROJECTS.map((p) => p.slug.length)) + 2;
  const head =
    pad("slug", slugWidth) + PROJECT_FIELDS.map((f) => pad(f, 14)).join("");

  const rows = PROJECTS.map(
    (p) =>
      pad(p.slug, slugWidth) +
      PROJECT_FIELDS.map((f) => pad(filled(p, f) ? "✓" : "·", 14)).join("")
  );

  const totals =
    pad(`合計 (${PROJECTS.length})`, slugWidth) +
    PROJECT_FIELDS.map((f) =>
      pad(
        `${PROJECTS.filter((p) => filled(p, f)).length}/${PROJECTS.length}`,
        14
      )
    ).join("");

  return [head, "-".repeat(head.length), ...rows, "", totals].join("\n");
}

function likesTable(): string {
  const rows = LIKE_CATEGORIES.map((cat) => {
    const n = cat.items.length;
    const count = (pred: (l: (typeof cat.items)[number]) => boolean) =>
      `${cat.items.filter(pred).length}/${n}`;
    return (
      pad(cat.en, 10) +
      pad(String(n), 8) +
      pad(
        count((l) => l.personRating != null),
        16
      ) +
      pad(
        count((l) => !!l.note),
        12
      ) +
      pad(
        count((l) => !!l.sub),
        12
      ) +
      pad(
        count((l) => !!l.href),
        12
      )
    );
  });

  const head =
    pad("category", 10) +
    pad("items", 8) +
    pad("personRating", 16) +
    pad("note", 12) +
    pad("sub", 12) +
    pad("href", 12);

  return [head, "-".repeat(head.length), ...rows].join("\n");
}

export function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  const body = [
    "PROJECTS — 選填欄位填寫狀況",
    "",
    projectTable(),
    "",
    "",
    "LIKES — 選填欄位覆蓋率",
    "",
    likesTable(),
    "",
  ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
