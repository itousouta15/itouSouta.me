import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "itousouta.me",
    short_name: "itouSouta",
    description: "itouSouta / 郭家睿 / 伊藤蒼太的個人網站 ε(*´･∀･｀)зﾞ",
    start_url: "/",
    display: "standalone",
    background_color: "#1b1e23",
    theme_color: "#1b1e23",
    lang: "zh-Hant",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
