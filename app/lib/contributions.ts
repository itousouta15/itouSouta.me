import { site } from "../template/config";

export const CONTRIBUTION_USER = site.githubUsername;

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface ContributionCell extends ContributionDay {
  x: number;
  y: number;
}

const DAY_MS = 86400000;

/** Validate upstream data on both sides of the API boundary. Never invent days. */
export function readContributionDays(value: unknown): ContributionDay[] {
  if (!value || typeof value !== "object" || !("contributions" in value))
    throw new Error("Missing contribution data");
  const days = value.contributions;
  if (!Array.isArray(days) || days.length < 1 || days.length > 371)
    throw new Error("Invalid contribution range");
  const parsed = days
    .map((day: unknown): ContributionDay => {
      if (!day || typeof day !== "object") throw new Error("Invalid day");
      const item = day as Record<string, unknown>;
      const { date, count, level } = item;
      if (
        typeof date !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isFinite(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date ||
        typeof count !== "number" ||
        !Number.isSafeInteger(count) ||
        count < 0 ||
        typeof level !== "number" ||
        !Number.isInteger(level) ||
        level < 0 ||
        level > 4
      )
        throw new Error("Invalid contribution day");
      return { date, count, level };
    })
    .sort((a, b) => a.date.localeCompare(b.date));
  for (let i = 1; i < parsed.length; i++) {
    if (Date.parse(parsed[i].date) - Date.parse(parsed[i - 1].date) !== DAY_MS)
      throw new Error("Duplicate or missing contribution day");
  }
  return parsed;
}

export function contributionCells(days: ContributionDay[]): ContributionCell[] {
  if (!days.length) return [];
  const offset = new Date(days[0].date).getUTCDay();
  return days.map((day, i) => ({
    ...day,
    x: Math.floor((i + offset) / 7),
    y: (i + offset) % 7,
  }));
}

export function contributionLabel(day: ContributionDay): string {
  return `${day.date} · ${day.count.toLocaleString("zh-TW")} 次貢獻`;
}
