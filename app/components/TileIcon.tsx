type IconMeta = {
  label: string;
  src: string;
  bg: string;
  filter?: string;
};

const DEVICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

export const TILE_ICON_META: Record<string, IconMeta> = {
  c: {
    label: "C",
    src: `${DEVICON_BASE}/c/c-original.svg`,
    bg: "#172437",
  },
  cpp: {
    label: "C++",
    src: `${DEVICON_BASE}/cplusplus/cplusplus-original.svg`,
    bg: "#172943",
  },
  cs: {
    label: "C#",
    src: `${DEVICON_BASE}/csharp/csharp-original.svg`,
    bg: "#241b38",
  },
  py: {
    label: "Python",
    src: `${DEVICON_BASE}/python/python-original.svg`,
    bg: "#1a2632",
  },
  html: {
    label: "HTML",
    src: `${DEVICON_BASE}/html5/html5-original.svg`,
    bg: "#2d1d19",
  },
  css: {
    label: "CSS",
    src: `${DEVICON_BASE}/css3/css3-original.svg`,
    bg: "#17273f",
  },
  js: {
    label: "JavaScript",
    src: `${DEVICON_BASE}/javascript/javascript-original.svg`,
    bg: "#2d2a18",
  },
  ts: {
    label: "TypeScript",
    src: `${DEVICON_BASE}/typescript/typescript-original.svg`,
    bg: "#17283f",
  },
  git: {
    label: "Git",
    src: `${DEVICON_BASE}/git/git-original.svg`,
    bg: "#2d211c",
  },
  github: {
    label: "GitHub",
    src: `${DEVICON_BASE}/github/github-original.svg`,
    bg: "#20232c",
    filter: "invert(1)",
  },
  vscode: {
    label: "VS Code",
    src: `${DEVICON_BASE}/vscode/vscode-original.svg`,
    bg: "#172635",
  },
  docker: {
    label: "Docker",
    src: `${DEVICON_BASE}/docker/docker-original.svg`,
    bg: "#14293c",
  },
  unity: {
    label: "Unity",
    src: `${DEVICON_BASE}/unity/unity-original.svg`,
    bg: "#20232c",
  },
  godot: {
    label: "Godot",
    src: `${DEVICON_BASE}/godot/godot-original.svg`,
    bg: "#172b3a",
  },
  linux: {
    label: "Linux",
    src: `${DEVICON_BASE}/linux/linux-original.svg`,
    bg: "#2c291c",
  },
  dart: {
    label: "Dart",
    src: `${DEVICON_BASE}/dart/dart-original.svg`,
    bg: "#172b35",
  },
  flutter: {
    label: "Flutter",
    src: `${DEVICON_BASE}/flutter/flutter-original.svg`,
    bg: "#172b3e",
  },
  nextjs: {
    label: "Next.js",
    src: `${DEVICON_BASE}/nextjs/nextjs-original.svg`,
    bg: "#1c1c1f",
    filter: "invert(1)",
  },
  astro: {
    label: "Astro",
    src: `${DEVICON_BASE}/astro/astro-original.svg`,
    bg: "#17152b",
  },
  hexo: {
    label: "Hexo",
    src: "https://cdn.simpleicons.org/hexo",
    bg: "#0c2236",
  },
  scaict: {
    label: "SCAICT",
    src: "/icon/SCAICT.svg",
    bg: "#0f1b2e",
  },
  dlhit: {
    label: "DLHIT",
    src: "/icon/DLHIT.svg",
    bg: "#0f1b2e",
  },
};

export default function TileIcon({ kind }: { kind: string }) {
  const icon = TILE_ICON_META[kind];

  if (!icon) {
    return null;
  }

  return (
    <div
      title={icon.label}
      style={{
        position: "absolute",
        inset: 0,
        background: icon.bg,
        borderRadius: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={icon.src}
        alt={icon.label}
        style={{
          width: "52px",
          height: "52px",
          objectFit: "contain",
          filter: icon.filter,
        }}
      />
    </div>
  );
}
