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
  url: string;
}

type GithubEventSummary = {
  summary: string;
  url?: string;
};

function excerpt(text: string | null | undefined, maxLength = 220): string {
  const normalized = text?.replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > maxLength ? `${normalized.slice(0, maxLength - 1)}...` : normalized;
}

const EVENT_LABELS: Record<string, (payload: any, repo: string) => GithubEventSummary | null> = {
  PushEvent: (payload, repo) => {
    const count = payload.commits?.length ?? 0;
    if (count === 0) return null;
    return { summary: `Pushed ${count} commit${count === 1 ? "" : "s"} to ${repo}` };
  },
  CreateEvent: (payload, repo) =>
    payload.ref_type === "repository" ? { summary: `Created a new repository: ${repo}` } : null,
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
      ? { summary: `Opened an issue in ${repo}: ${payload.issue?.title ?? ""}`, url: payload.issue?.html_url }
      : null,
  ReleaseEvent: (payload, repo) =>
    payload.action === "published"
      ? { summary: `Published release ${payload.release?.tag_name ?? ""} in ${repo}`, url: payload.release?.html_url }
      : null,
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
