import type { MetadataRoute } from "next";
import { LIKE_CATEGORIES, PROJECTS } from "./data";
import { projectPath } from "./lib/projectRoutes";
import { getMergedThoughts } from "./lib/mergedThoughts";
import { getPostSummaries } from "./lib/posts";
import { SITE_URL } from "./lib/seo";

/* 靜態路由刻意不給 lastModified：內容跟著 data.ts 走，只有重新部署才會變，
   填 new Date() 等於每次抓 sitemap 都宣稱「剛剛改過」——沒訊號還不如省略。
   只有真的有時間戳可查的路由（/writing 與文章）才給。 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/api",
    "/experience",
    "/likes",
    "/likes/music",
    "/links",
    "/projects",
  ];

  const likeCategoryRoutes = LIKE_CATEGORIES.map((cat) => `/likes/${cat.key}`);

  const thoughts = await getMergedThoughts().catch(() => []);
  const posts = getPostSummaries();
  const now = Date.now();
  const newestThought = thoughts[0]?.timestamp;
  const newestPost = posts.reduce(
    (max, p) => (p.timestamp <= now ? Math.max(max, p.timestamp) : max),
    0
  );
  const newestWriting = Math.max(newestThought ?? 0, newestPost);

  return [
    ...[
      ...staticRoutes,
      ...likeCategoryRoutes,
      ...PROJECTS.map(projectPath),
    ].map((path) => ({
      url: `${SITE_URL}${path}`,
    })),
    {
      url: `${SITE_URL}/writing`,
      ...(newestWriting ? { lastModified: new Date(newestWriting) } : {}),
    },
    ...posts.map((post) => {
      const updated = Date.parse(post.updated ?? "");
      const lastModified = updated <= now ? updated : post.timestamp;
      return {
        url: `${SITE_URL}${post.path}`,
        ...(lastModified <= now && { lastModified: new Date(lastModified) }),
      };
    }),
  ];
}
