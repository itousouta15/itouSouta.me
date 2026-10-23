export interface ProjectScreenshot {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string;
  category: "development" | "design" | ("development" | "design")[];
  kicker: string;
  color: "blue" | "purple";
  title: string;
  desc: string;
  tags: string[];
  icon: string;
  href?: string;
  cover: string;
  screenshots?: ProjectScreenshot[];
  siteUrl?: string;
  figmaUrl?: string;
  content?: string;
  demoUrl?: string;
}

/** Edit the entries below; each project automatically gets a detail page. */
export const PROJECTS: Project[] = [
  {
    slug: "my-first-project",
    category: "development",
    kicker: "WEB",
    color: "blue",
    title: "第一個作品",
    desc: "用自己的作品取代這段示例介紹。",
    content: `## 專案介紹

這是一個範例專案。可以在這裡介紹你做了什麼、為什麼開始，以及學到的事。

## 技術與挑戰

用 Markdown 寫下製作過程，也能附上圖片與連結。`,
    tags: ["TypeScript", "React"],
    icon: "ts",
    cover: "/assets/template/banner.svg",
  },
  {
    slug: "creative-work",
    category: "design",
    kicker: "DESIGN",
    color: "purple",
    title: "創意作品",
    desc: "展示你的設計或創作。",
    content: "## 作品理念\n\n介紹作品的靈感與製作方法。",
    tags: ["設計"],
    icon: "figma",
    cover: "/assets/template/banner.svg",
  },
];
