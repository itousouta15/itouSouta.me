const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export type IconMeta = {
  label: string;
  src: string;
  bg: string;
  bgLight: string;
  filter?: string;
};

export const TILE_ICON_META: Record<string, IconMeta> = {
  c: {
    label: "C",
    src: `${DEVICON_BASE}/c/c-original.svg`,
    bg: "#172437",
    bgLight: "#ddeaf8",
  },
  cpp: {
    label: "C++",
    src: `${DEVICON_BASE}/cplusplus/cplusplus-plain.svg`,
    bg: "#172943",
    bgLight: "#dce8f8",
  },
  cs: {
    label: "C#",
    src: `${DEVICON_BASE}/csharp/csharp-original.svg`,
    bg: "#241b38",
    bgLight: "#ede6f8",
  },
  py: {
    label: "Python",
    src: `${DEVICON_BASE}/python/python-original.svg`,
    bg: "#1a2632",
    bgLight: "#e0ecf5",
  },
  html: {
    label: "HTML",
    src: `${DEVICON_BASE}/html5/html5-original.svg`,
    bg: "#2d1d19",
    bgLight: "#fbe8dc",
  },
  css: {
    label: "CSS",
    src: `${DEVICON_BASE}/css3/css3-original.svg`,
    bg: "#17273f",
    bgLight: "#dce8f8",
  },
  js: {
    label: "JavaScript",
    src: `${DEVICON_BASE}/javascript/javascript-original.svg`,
    bg: "#2d2a18",
    bgLight: "#faf8dc",
  },
  ts: {
    label: "TypeScript",
    src: `${DEVICON_BASE}/typescript/typescript-original.svg`,
    bg: "#17283f",
    bgLight: "#dce8f8",
  },
  git: {
    label: "Git",
    src: `${DEVICON_BASE}/git/git-original.svg`,
    bg: "#2d211c",
    bgLight: "#fbe8dc",
  },
  github: {
    label: "GitHub",
    src: `${DEVICON_BASE}/github/github-original.svg`,
    bg: "#20232c",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  vscode: {
    label: "VS Code",
    src: `${DEVICON_BASE}/vscode/vscode-original.svg`,
    bg: "#172635",
    bgLight: "#dce8f5",
  },
  docker: {
    label: "Docker",
    src: `${DEVICON_BASE}/docker/docker-original.svg`,
    bg: "#14293c",
    bgLight: "#d8e8f8",
  },
  unity: {
    label: "Unity",
    src: `${DEVICON_BASE}/unity/unity-original.svg`,
    bg: "#20232c",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  godot: {
    label: "Godot",
    src: `${DEVICON_BASE}/godot/godot-original.svg`,
    bg: "#172b3a",
    bgLight: "#dce8f5",
  },
  linux: {
    label: "Linux",
    src: `${DEVICON_BASE}/linux/linux-original.svg`,
    bg: "#2c291c",
    bgLight: "#f5f0d8",
  },
  dart: {
    label: "Dart",
    src: `${DEVICON_BASE}/dart/dart-original.svg`,
    bg: "#172b35",
    bgLight: "#dce8f5",
  },
  flutter: {
    label: "Flutter",
    src: `${DEVICON_BASE}/flutter/flutter-original.svg`,
    bg: "#172b3e",
    bgLight: "#dce8f8",
  },
  nextjs: {
    label: "Next.js",
    src: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
    bg: "#1c1c1f",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  astro: {
    label: "Astro",
    src: `${DEVICON_BASE}/astro/astro-original.svg`,
    bg: "#17152b",
    bgLight: "#ede8f8",
  },
  hexo: {
    label: "Hexo",
    src: "https://cdn.simpleicons.org/hexo",
    bg: "#0c2236",
    bgLight: "#d8e8f5",
  },
  scaict: {
    label: "SCAICT",
    src: "/icon/SCAICT.svg",
    bg: "#0f1b2e",
    bgLight: "#dce8f8",
  },
  dlhit: {
    label: "DLHIT",
    src: "/icon/DLHIT.svg",
    bg: "#0f1b2e",
    bgLight: "#dce8f8",
  },
};
