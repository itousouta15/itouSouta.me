import { getBlogPosts } from "../../lib/blogFeed";
import { getMergedThoughts } from "../../lib/mergedThoughts";

/* Cmd+K 搜尋索引裡「非靜態」的那一半：部落格碎碎念。

   為什麼不直接在 layout 裡 await：root layout 是 server component，await 編得過，
   但在那裡放一個帶 cache 的 fetch 會把 revalidate 傳染給每一條路由，把 /、/links、
   /experience、/likes/[category] 從全靜態降級成 ISR——為了一個鍵盤快捷鍵付出全站
   代價，還會把三個不穩的外部 API 綁進根 layout 的渲染。

   改成獨立端點後，CommandPaletteInner 掛載時才抓（面板在按 Cmd+K 之前根本不會
   渲染），而且 getBlogPosts / getMergedThoughts 都已經被 /writing 放進
   Next 的 Data Cache，這裡多半是 cache 讀取。 */

export const revalidate = 3600;

// 雜談沒有深層連結，全部指向 /writing；收太多只是把搜尋結果洗版
const MAX_THOUGHTS = 20;

export interface RemoteSearchItem {
  id: string;
  title: string;
  sub?: string;
  href: string;
  external?: boolean;
  category: string;
}

export async function GET() {
  const [posts, thoughts] = await Promise.all([
    getBlogPosts().catch(() => []),
    getMergedThoughts().catch(() => []),
  ]);

  const items: RemoteSearchItem[] = [
    ...posts.map((p) => ({
      id: `blog-${p.id}`,
      title: p.title,
      sub: p.excerpt.slice(0, 60),
      href: p.url,
      external: true,
      category: "文章",
    })),
    ...thoughts.slice(0, MAX_THOUGHTS).map((t) => ({
      id: `thought-${t.id}`,
      title: t.text ?? "",
      sub: t.date,
      href: "/writing",
      category: "雜談",
    })),
  ].filter((item) => item.title.trim() !== "");

  return Response.json({ items });
}
