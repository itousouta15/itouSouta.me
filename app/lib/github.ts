const API_BASE = "https://api.github.com";

function authHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/vnd.github+json" };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export function parseGithubRepo(href: string): { owner: string; repo: string } | null {
  const m = href.match(/^https:\/\/github\.com\/([^/]+)\/([^/]+?)(?:\.git)?\/?$/);
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

export async function getRepoInfo(owner: string, repo: string): Promise<GithubRepoInfo | null> {
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

export interface GithubEvent {
  id: string;
  type: string;
  repo: string;
  createdAt: string;
  summary: string;
}

const EVENT_LABELS: Record<string, (payload: any, repo: string) => string | null> = {
  PushEvent: (payload, repo) => {
    const count = payload.commits?.length ?? 0;
    if (count === 0) return null;
    return `推送了 ${count} 個 commit 到 ${repo}`;
  },
  CreateEvent: (payload, repo) =>
    payload.ref_type === "repository" ? `建立了新專案 ${repo}` : null,
  PullRequestEvent: (payload, repo) =>
    payload.action === "opened" ? `在 ${repo} 開了一個 PR：${payload.pull_request?.title ?? ""}` : null,
  IssuesEvent: (payload, repo) =>
    payload.action === "opened" ? `在 ${repo} 開了一個 Issue：${payload.issue?.title ?? ""}` : null,
  ReleaseEvent: (payload, repo) =>
    payload.action === "published" ? `在 ${repo} 發布了 Release ${payload.release?.tag_name ?? ""}` : null,
};

export async function getUserEvents(username: string): Promise<GithubEvent[]> {
  const res = await fetch(`${API_BASE}/users/${username}/events/public?per_page=30`, {
    headers: authHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) return [];
  const json: any[] = await res.json();

  const events: GithubEvent[] = [];
  for (const e of json) {
    const label = EVENT_LABELS[e.type];
    if (!label) continue;
    const summary = label(e.payload, e.repo?.name ?? "");
    if (!summary) continue;
    events.push({ id: e.id, type: e.type, repo: e.repo?.name ?? "", createdAt: e.created_at, summary });
  }
  return events;
}
