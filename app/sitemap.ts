import type { MetadataRoute } from "next";
import { LIKE_CATEGORIES, PROJECTS } from "./data";
import { getMergedThoughts } from "./lib/mergedThoughts";
import { getBlogPosts } from "./lib/blogFeed";

const SITE_URL = "https://itousouta.me";

/* 靜態路由刻意不給 lastModified：內容跟著 data.ts 走，只有重新部署才會變，
   填 new Date() 等於每次抓 sitemap 都宣稱「剛剛改過」——沒訊號還不如省略。
   只有真的有時間戳可查的路由（/thoughts）才給。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/experience",
    "/likes",
    "/likes/music",
    "/links",
    "/projects",
    "/stats",
  ];

  const likeCategoryRoutes = LIKE_CATEGORIES.map((cat) => `/likes/${cat.key}`);
  const projectRoutes = PROJECTS.map((p) => `/projects/${p.slug}`);

  const [thoughts, posts] = await Promise.all([
    getMergedThoughts().catch(() => []),
    getBlogPosts().catch(() => []),
  ]);
  const newestThought = thoughts[0]?.timestamp;
  // 部落格列表刻意不排序（見 blogFeed.ts），所以這裡自己取最大值
  const newestPost = posts.reduce((max, p) => Math.max(max, p.timestamp), 0);

  return [
    ...[...staticRoutes, ...likeCategoryRoutes, ...projectRoutes].map(
      (path) => ({
        url: `${SITE_URL}${path}`,
      })
    ),
    {
      url: `${SITE_URL}/thoughts`,
      ...(newestThought ? { lastModified: new Date(newestThought) } : {}),
    },
    {
      url: `${SITE_URL}/blog`,
      ...(newestPost ? { lastModified: new Date(newestPost) } : {}),
    },
  ];
}
