const API_BASE = "https://api.github.com";

function authHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function parseGithubRepo(
  href: string
): { owner: string; repo: string } | null {
  const m = href.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/
  );
  if (!m) return null;
  return { owner: m[1], repo: m[2] };
}

export interface GithubRepoInfo {
  stars: number;
  openIssues: number;
  language: string | null;
  pushedAt: string;
  defaultBranch: string;
}

export async function getRepoInfo(
  owner: string,
  repo: string
): Promise<GithubRepoInfo | null> {
  const res = await fetch(`${API_BASE}/repos/${owner}/${repo}`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return {
    stars: json.stargazers_count ?? 0,
    openIssues: json.open_issues_count ?? 0,
    language: json.language ?? null,
    pushedAt: json.pushed_at,
    defaultBranch: json.default_branch ?? "main",
  };
}

/**
 * Repo info for a whole batch of projects, keyed by slug.
 *
 * `getRepoInfo` carries `revalidate: 3600`, and Next's Data Cache dedupes by
 * URL across routes — so /projects and the command palette both calling this
 * costs one set of requests, not two. Sharing it is about the code, not the
 * request count.
 */
export async function getAllRepoInfo(
  projects: { slug: string; href: string }[]
): Promise<Record<string, GithubRepoInfo | null>> {
  const entries = await Promise.all(
    projects.map(async (p) => {
      const ref = parseGithubRepo(p.href);
      const info = ref
        ? await getRepoInfo(ref.owner, ref.repo).catch(() => null)
        : null;
      return [p.slug, info] as const;
    })
  );
  return Object.fromEntries(entries);
}

export interface GithubReleaseEntry {
  version: string;
  date: string;
  note?: string;
}

// Release name 裡版本號後面常接 "— 說明文字"（em dash／en dash／連字號皆可），
// 例如 "itouOJ 收件程式 v1.2.0 — 瀏覽器登入、精靈式流程、登出"，把後半段拆出來當 note。
const RELEASE_NOTE_SEPARATOR = /\s+[—–-]\s+/;

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // [text](url) -> text
    .replace(/[*_`]{1,3}([^*_`]+)[*_`]{1,3}/g, "$1") // **bold** / *em* / `code`
    .trim();
}

/**
 * 抓 release body 標題／條列前的第一段當候選摘要——很多 release 習慣先寫一句
 * 「這一版修正了什麼」再接 "## 重點" 的細節條列，那句話本身就是現成的摘要。
 * 如果 body 一開頭就是標題或條列（沒有這種引言），代表沒東西可摘要，回傳 undefined。
 */
function extractIntroParagraph(
  body: string | null | undefined
): string | undefined {
  if (!body) return undefined;
  const trimmed = body.trimStart();
  if (/^(#{1,6}\s|[-*]\s)/.test(trimmed)) return undefined;

  // 只取第一段：碰到空行或標題／條列就停，避免把後面不相干的段落黏在一起
  const para = trimmed.split(/\r?\n\s*\r?\n|\r?\n\s*(?:#{1,6}\s|[-*]\s)/)[0];
  const cleaned = stripMarkdown(para).replace(/\s+/g, " ").trim();
  return cleaned || undefined;
}

/** 優先切在第一個句尾標點，其次逗號類標點，讓摘要維持一句話而不是硬切斷字。 */
function shortenSummary(text: string, maxLength = 40): string {
  const sentenceEnd = text.search(/[。！？]/);
  if (sentenceEnd !== -1 && sentenceEnd <= maxLength) {
    return text.slice(0, sentenceEnd + 1);
  }
  const clauseEnd = text.search(/[，、：；]/);
  if (clauseEnd !== -1 && clauseEnd <= maxLength) {
    return text.slice(0, clauseEnd);
  }
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

export async function getReleases(
  owner: string,
  repo: string
): Promise<GithubReleaseEntry[]> {
  const res = await fetch(
    `${API_BASE}/repos/${owner}/${repo}/releases?per_page=100`,
    {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return [];
  const json: any[] = await res.json();
  const published = json.filter((r) => !r.draft && r.published_at);

  // 有些 repo 的每篇 release 都固定貼一段專案簡介再接當次改動——那段簡介逐字重複，
  // 不是「這一版做了什麼」。抓出所有候選引言，出現一次以上的視為樣板，不當摘要用。
  const intros = published.map((r) => extractIntroParagraph(r.body));
  const introCounts = new Map<string, number>();
  for (const intro of intros) {
    if (intro) introCounts.set(intro, (introCounts.get(intro) ?? 0) + 1);
  }

  const entries = published.map((r, i): GithubReleaseEntry => {
    const name: string = r.name?.trim() || r.tag_name;
    const [, ...rest] = name.split(RELEASE_NOTE_SEPARATOR);
    const intro = intros[i];
    const note =
      rest.length > 0
        ? rest.join(" — ")
        : intro && introCounts.get(intro) === 1
          ? shortenSummary(intro)
          : undefined;
    return {
      version: r.tag_name,
      date: r.published_at.slice(0, 10),
      note,
    };
  });

  // GitHub 回傳新到舊，timeline 要照時間正序（舊到新）顯示
  return entries.reverse();
}

/**
 * Release timeline for a whole batch of projects, keyed by slug. 只查
 * `releaseTimeline: true` 的專案——同一個 repo 可能掛著好幾個子專案的
 * href，沒有明確 opt-in 就抓全部的話，release 會誤植到不相干的卡片上。
 */
export async function getAllReleases(
  projects: { slug: string; href: string; releaseTimeline?: boolean }[]
): Promise<Record<string, GithubReleaseEntry[]>> {
  const entries = await Promise.all(
    projects
      .filter((p) => p.releaseTimeline)
      .map(async (p) => {
        const ref = parseGithubRepo(p.href);
        const releases = ref
          ? await getReleases(ref.owner, ref.repo).catch(() => [])
          : [];
        return [p.slug, releases] as const;
      })
  );
  return Object.fromEntries(entries);
}

export interface GithubEvent {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
  summary: string;
  url: string;
}

type GithubEventSummary = {
  summary: string;
  url?: string;
};

function excerpt(text: string | null | undefined, maxLength = 220): string {
  const normalized = text?.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 1)}...`
    : normalized;
}

const EVENT_LABELS: Record<
  string,
  (payload: any, repo: string) => GithubEventSummary | null
> = {
  PushEvent: (payload, repo) => {
    const count = payload.commits?.length ?? 0;
    if (count === 0) return null;
    return {
      summary: `Pushed ${count} commit${count === 1 ? "" : "s"} to ${repo}`,
    };
  },
  CreateEvent: (payload, repo) =>
    payload.ref_type === "repository"
      ? { summary: `Created a new repository: ${repo}` }
      : null,
  PullRequestEvent: (payload, repo) => {
    if (payload.action !== "opened") return null;

    const title = payload.pull_request?.title?.trim();
    const body = excerpt(payload.pull_request?.body);
    const detail = [title, body].filter(Boolean).join("\n\n");
    if (!detail) return null;

    return {
      summary: `Opened a PR in ${repo}:\n${detail}`,
      url: payload.pull_request?.html_url,
    };
  },
  IssuesEvent: (payload, repo) =>
    payload.action === "opened"
      ? {
          summary: `Opened an issue in ${repo}: ${payload.issue?.title ?? ""}`,
          url: payload.issue?.html_url,
        }
      : null,
  ReleaseEvent: (payload, repo) =>
    payload.action === "published"
      ? {
          summary: `Published release ${payload.release?.tag_name ?? ""} in ${repo}`,
          url: payload.release?.html_url,
        }
      : null,
};

export async function getUserEvents(username: string): Promise<GithubEvent[]> {
  const res = await fetch(
    `${API_BASE}/users/${username}/events/public?per_page=30`,
    {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    }
  );
  if (!res.ok) return [];
  const json: any[] = await res.json();

  const events: GithubEvent[] = [];
  for (const e of json) {
    const label = EVENT_LABELS[e.type];
    if (!label) continue;

    const repo = e.repo?.name ?? "";
    const event = label(e.payload, repo);
    if (!event) continue;

    events.push({
      id: e.id,
      type: e.type,
      repo,
      createdAt: e.created_at,
      summary: event.summary,
      url: event.url ?? `https://github.com/${repo}`,
    });
  }
  return events;
}
