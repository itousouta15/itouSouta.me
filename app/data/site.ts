export interface Role {
  label: string;
  color: "blue" | "purple";
}

export const ROLES: Role[] = [
  { label: "創作者", color: "blue" },
  { label: "開發者", color: "purple" },
];

export const TILE_COLS: string[][] = [
  ["c", "cpp", "cs", "py", "html", "css"],
  ["js", "ts", "git", "github", "vscode", "docker"],
  ["unity", "godot", "linux", "dart", "flutter"],
];

export const MARQUEE: string[] = ["WELCOME", "MY CORNER", "CREATE", "SHARE"];
