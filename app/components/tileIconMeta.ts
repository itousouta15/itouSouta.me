// 圖示全部自架在 /public/assets/icons：原本走 jsdelivr（devicon）與
// simpleicons 兩個第三方 CDN，快取政策差（7 天／1 天）又多了兩次 DNS。
// devicon 的 linux-original 插畫版高達 191KB，改用同系的 linux-plain（2.8KB）。

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
    src: `/assets/icons/c-original.svg`,
    bg: "#172437",
    bgLight: "#ddeaf8",
  },
  cpp: {
    label: "C++",
    src: `/assets/icons/cplusplus-plain.svg`,
    bg: "#172943",
    bgLight: "#dce8f8",
  },
  cs: {
    label: "C#",
    src: `/assets/icons/csharp-original.svg`,
    bg: "#241b38",
    bgLight: "#ede6f8",
  },
  py: {
    label: "Python",
    src: `/assets/icons/python-original.svg`,
    bg: "#1a2632",
    bgLight: "#e0ecf5",
  },
  html: {
    label: "HTML",
    src: `/assets/icons/html5-original.svg`,
    bg: "#2d1d19",
    bgLight: "#fbe8dc",
  },
  css: {
    label: "CSS",
    src: `/assets/icons/css3-original.svg`,
    bg: "#17273f",
    bgLight: "#dce8f8",
  },
  js: {
    label: "JavaScript",
    src: `/assets/icons/javascript-original.svg`,
    bg: "#2d2a18",
    bgLight: "#faf8dc",
  },
  ts: {
    label: "TypeScript",
    src: `/assets/icons/typescript-original.svg`,
    bg: "#17283f",
    bgLight: "#dce8f8",
  },
  git: {
    label: "Git",
    src: `/assets/icons/git-original.svg`,
    bg: "#2d211c",
    bgLight: "#fbe8dc",
  },
  github: {
    label: "GitHub",
    src: `/assets/icons/github-original.svg`,
    bg: "#20232c",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  vscode: {
    label: "VS Code",
    src: `/assets/icons/vscode-original.svg`,
    bg: "#172635",
    bgLight: "#dce8f5",
  },
  docker: {
    label: "Docker",
    src: `/assets/icons/docker-original.svg`,
    bg: "#14293c",
    bgLight: "#d8e8f8",
  },
  unity: {
    label: "Unity",
    src: `/assets/icons/unity-original.svg`,
    bg: "#20232c",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  godot: {
    label: "Godot",
    src: `/assets/icons/godot-original.svg`,
    bg: "#172b3a",
    bgLight: "#dce8f5",
  },
  linux: {
    label: "Linux",
    src: `/assets/icons/linux-plain.svg`,
    bg: "#2c291c",
    bgLight: "#f5f0d8",
  },
  dart: {
    label: "Dart",
    src: `/assets/icons/dart-original.svg`,
    bg: "#172b35",
    bgLight: "#dce8f5",
  },
  flutter: {
    label: "Flutter",
    src: `/assets/icons/flutter-original.svg`,
    bg: "#172b3e",
    bgLight: "#dce8f8",
  },
  nextjs: {
    label: "Next.js",
    src: `/assets/icons/nextjs-original.svg`,
    bg: "#1c1c1f",
    bgLight: "#e8e8ec",
    filter: "invert(1)",
  },
  astro: {
    label: "Astro",
    src: `/assets/icons/astro-original.svg`,
    bg: "#17152b",
    bgLight: "#ede8f8",
  },
  hexo: {
    label: "Hexo",
    src: "/assets/icons/si-hexo.svg",
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
