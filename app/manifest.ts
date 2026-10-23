import type { MetadataRoute } from "next";
import { site } from "./template/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.title,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#1b1e23",
    theme_color: "#1b1e23",
    lang: site.locale,
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
