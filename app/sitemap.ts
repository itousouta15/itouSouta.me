import type { MetadataRoute } from "next";
import { LIKE_CATEGORIES } from "./data";

const SITE_URL = "https://itousouta.me";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/likes",
    "/likes/music",
    "/links",
    "/projects",
    "/thoughts",
  ];

  const likeCategoryRoutes = LIKE_CATEGORIES.map(cat => `/likes/${cat.key}`);

  return [...staticRoutes, ...likeCategoryRoutes].map(path => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));
}
