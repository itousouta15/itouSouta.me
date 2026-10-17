import { PROJECTS, type Project } from "../data/projects";

const LEGACY_SLUGS: Record<string, string> = {
  "https://west.nchusdsc.org/": "west-link-tree",
  "thjcc website": "thjcc-website",
  "itouoj 收件程式": "itouoj-submitter",
};

export function findProject(slug: string): Project | undefined {
  const normalized = slug.toLowerCase();
  return PROJECTS.find(
    (p) => p.slug === (LEGACY_SLUGS[normalized] ?? normalized)
  );
}

export function projectPath(project: Pick<Project, "slug">): string {
  return `/projects/${encodeURIComponent(project.slug)}`;
}

export function projectSearchPath(query: string): string {
  return query ? `/projects?${new URLSearchParams({ q: query })}` : "/projects";
}

export function matchesProject(project: Project, query: string): boolean {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const text = [
    project.title,
    project.desc,
    project.content,
    project.kicker,
    ...project.tags,
  ]
    .join(" ")
    .toLocaleLowerCase();
  return terms.every((term) => text.includes(term));
}
