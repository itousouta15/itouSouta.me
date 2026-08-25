export interface Role {
  label: string;
  color: "blue" | "purple";
}

export const ROLES: Role[] = [
  { label: "A Student", color: "blue" },
  { label: "Mankind", color: "blue" },
  { label: "Dev.", color: "purple" },
  { label: "Vocalo-P", color: "purple" },
  { label: "Illust.", color: "purple" },
];

export const TILE_COLS: string[][] = [
  ["c", "cpp", "cs", "py", "html", "css"],
  ["js", "ts", "git", "github", "vscode", "docker"],
  ["unity", "godot", "linux", "dart", "flutter"],
];

export const MARQUEE: string[] = [
  "ciallo (∠·ω )⌒★",
  "I'm itouSouta",
  "郭家睿",
  "伊藤蒼太",
  "人間になりたい",
  "DEVELOPER",
  "VOCALO-P",
  "ILLUSTRATOR",
  "情熱を失っては、何もできない。",
  "Zzzz",
];
