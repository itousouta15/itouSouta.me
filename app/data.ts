export interface Role {
  label: string;
  color: "blue" | "purple";
}

export interface Social {
  label: string;
  href: string;
}

export interface Like {
  title: string;
  sub: string;
}

export interface Project {
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
}

export const ROLES: Role[] = [
  { label: "A Student", color: "blue" },
  { label: "Mankind", color: "blue" },
  { label: "Dev.", color: "purple" },
  { label: "Vocalo-P", color: "purple" },
  { label: "Illust.", color: "purple" },
];

export const SOCIALS: Social[] = [
  { label: "X", href: "#" },
  { label: "YT", href: "#" },
  { label: "px", href: "#" },
  { label: "nc", href: "#" },
];

export const TILE_COLS: string[][] = [
  ["c", "cpp", "cs", "py", "html", "css"],
  ["js", "ts", "git", "github", "vscode", "docker"],
  ["unity", "godot", "linux", "dart", "flutter"],
];

export const MARQUEE: string[] = [
  "ciallo (∠·ω )⌒★",
  "I'm itouSouta",
  "人間になりたい",
  "DEVELOPER",
  "VOCALO-P",
  "ILLUSTRATOR",
  "情熱を失っては、何もできない。",
  "Zzzz",
];

export const LIKES: Like[] = [
  { title: "VOCALOID", sub: "初音ミク・歌声合成" },
  { title: "音樂", sub: "Music" },
  { title: "插畫", sub: "Illustration" },
  { title: "遊戲", sub: "Game" },
  { title: "動畫", sub: "Anime" },
  { title: "咖啡", sub: "Coffee" },
];

export const PROJECTS: Project[] = [
  { kicker: "MUSIC", color: "blue", title: "Project 01", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Vocaloid", "2024"] },
  { kicker: "ILLUST", color: "purple", title: "Project 02", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Illustration", "pixiv"] },
  { kicker: "CODE", color: "blue", title: "Project 03", desc: "專案說明佔位文字，之後可換成你的作品介紹。", tags: ["Web", "GitHub"] },
];

/**
 * Lanyard live status (Spotify + Discord) for the home page cards.
 * Lanyard reads your presence from Discord — to enable it:
 *   1. Join the Lanyard Discord server: https://discord.gg/lanyard
 *   2. Put your numeric Discord user ID below (developer mode → 右鍵頭像 → 複製使用者 ID)
 * Leave it empty and the cards render a friendly "未連結" placeholder instead.
 */
export const DISCORD_USER_ID = "942765194571055164";

export interface LinkItem {
  name: string;
  handle: string;
  href: string;
  desc?: string;
  color?: "blue" | "purple";
}

export const LINKS: LinkItem[] = [
  { name: "友站名稱", handle: "@example", href: "https://example.com", desc: "友站說明佔位文字，之後換成你朋友的介紹。", color: "blue" },
  { name: "友站名稱", handle: "@example", href: "https://example.com", desc: "友站說明佔位文字，之後換成你朋友的介紹。", color: "purple" },
  { name: "友站名稱", handle: "@example", href: "https://example.com", desc: "友站說明佔位文字，之後換成你朋友的介紹。", color: "blue" },
];

export interface ExperienceItem {
  period: string;
  title: string;
  org?: string;
  desc?: string;
  color?: "blue" | "purple";
}

export const EXPERIENCE: ExperienceItem[] = [
  { period: "2024 — 現在", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "blue" },
  { period: "2022 — 2024", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "purple" },
  { period: "2020 — 2022", title: "經歷標題佔位", org: "單位 / 組織", desc: "經歷說明佔位文字，之後可換成你的實際內容。", color: "blue" },
];
