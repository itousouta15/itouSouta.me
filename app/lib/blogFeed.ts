/* 站內部落格列表的資料來源：blog.itousouta.me（獨立的 Hexo 專案）的 Atom feed。
   文章本體仍然在部落格那邊，這裡只做索引。

   刻意不裝 XML 解析套件：來源只有一個產生器（hexo-generator-feed）、模板固定、
   一次十幾筆，為了一頁的 server 端解析多一個 runtime dependency 不划算。
   app/feed.xml/route.ts 本來就手刻 escapeXml，這裡寫它的反向而已。 */

const FEED_URL = "https://blog.itousouta.me/atom.xml";

export interface BlogPost {
  id: string;
  title: string;
  url: string;
  /** 顯示用的 zh-TW 日期字串 */
  date: string;
  timestamp: number;
  excerpt: string;
  category?: string;
}

function decodeXml(s: string): string {
  return (
    s
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
        String.fromCodePoint(parseInt(n, 16))
      )
      // & 一定要最後解，不然上面幾條會把 &amp;lt; 這種二次跳脫解錯
      .replace(/&amp;/g, "&")
  );
}

/** 取元素內容。一律按元素名抓，不靠出現順序。 */
function pick(entry: string, tag: string): string | undefined {
  const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decodeXml(m[1]).trim() : undefined;
}

/* 主題的 i18n 產生器（_config.reimu.yml 的 languages: [zh-TW, en, ja]）會把每篇
   文章輸出三份，<id> 與 <link> 完全相同、只有 <title>/<summary> 是不同語言——
   20 個 entry 其實只有 8 篇。而且語言的排列順序不固定（SCAICT 那篇是 日→英→中），
   所以不能取第一筆，得真的判斷語言。

   判準：中文與日文共用漢字，但只有日文會出現假名，而英文版沒有漢字。 */
function zhScore(text: string): number {
  const han = (text.match(/[一-鿿]/g) ?? []).length; // 漢字
  const kana = (text.match(/[぀-ヿ]/g) ?? []).length; // 平假名 + 片假名
  if (han === 0) return 0; // 純拉丁 = 英文版
  return 1 / (1 + kana * 4); // 假名越多越可能是日文版
}

function cleanExcerpt(raw: string): string {
  return (
    raw
      // summary 是 content_limit 直接截斷的原始 Markdown，引言與粗體記號會漏出來
      .replace(/[>#*`]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const xml = await res.text();

    const byId = new Map<string, { entry: string; score: number }>();

    for (const m of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
      const entry = m[1];
      const id = pick(entry, "id");
      if (!id) continue;

      const score = zhScore(
        `${pick(entry, "title") ?? ""}${pick(entry, "summary") ?? ""}`
      );
      const existing = byId.get(id);
      // 同分保留先出現的那筆，讓輸出順序穩定
      if (!existing || score > existing.score) byId.set(id, { entry, score });
    }

    const posts: BlogPost[] = [];
    for (const [id, { entry }] of byId) {
      const title = pick(entry, "title");
      if (!title) continue;

      const url = entry.match(/<link[^>]*href="([^"]+)"/)?.[1] ?? id;
      const published = pick(entry, "published") ?? pick(entry, "updated");
      const timestamp = published ? new Date(published).getTime() : NaN;

      // 第一個 categories/ 的 term 是分類，後面的是標籤
      const category = entry.match(
        /<category[^>]*term="([^"]+)"[^>]*scheme="[^"]*\/categories\//
      )?.[1];

      posts.push({
        id,
        title,
        url,
        date: Number.isFinite(timestamp) ? formatDate(timestamp) : "",
        timestamp: Number.isFinite(timestamp) ? timestamp : 0,
        excerpt: cleanExcerpt(pick(entry, "summary") ?? ""),
        category: category ? decodeXml(category) : undefined,
      });
    }

    /* 刻意不重新排序：feed 本來就是部落格自己的順序，跟著它走，站內列表才會跟
       blog.itousouta.me 首頁一致。（附帶效果：那篇日期寫 6767 年的文章會一直
       釘在最前面——那是它在部落格上本來就有的行為。想改成依時間排就在這裡
       .sort((a, b) => b.timestamp - a.timestamp) 即可。） */
    return posts;
  } catch {
    // 對外請求失敗一律視為「沒有資料」，讓頁面降級而不是整頁掛掉
    return [];
  }
}
