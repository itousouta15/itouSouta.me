/* OG 圖用的中文字型。

   next/og 只內建一份 27KB 的 Noto Sans latin，中文會整片變豆腐；而 satori 要的是
   TTF/OTF 的 ArrayBuffer，**不吃 WOFF2**——偏偏 fonts.googleapis.com/css2 給現代
   UA 的就是 WOFF2。所以這裡用舊版 UA 去要 CSS，換回 .ttf 的網址。

   為什麼是「每張圖抓自己要的字」而不是把字型檔簽進 repo：完整的 Noto Serif TC
   是 5–10MB，而且每次改內容都要重新子集化；用 Google Fonts 的 text= 參數，一張
   圖大約 30 個字只要 3–6KB。站上本來就從 fonts.googleapis.com 載字型，沒有新增
   信任邊界。

   只用 Noto Serif TC，不碰 ChenYuLuoYan / LXGWHeartSerif——那兩個來自 font.emtech.cc
   的純 CSS、沒有 text= 子集，等於把數 MB 的中文字型拉進 build。而且 .page-title 的
   Shippori Mincho 本來就沒有繁中字符，瀏覽器現在渲染那些標題用的就是 Noto Serif TC。*/

// 舊版 UA：新版會拿到 woff2，satori 讀不了
const LEGACY_UA =
  "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.85 Safari/537.36";

const cache = new Map<string, ArrayBuffer | null>();

export async function loadNotoSerifTC(
  text: string
): Promise<ArrayBuffer | null> {
  // 去重後才送出去，網址長度跟子集大小都只跟「不重複的字」有關
  const chars = Array.from(new Set(text.replace(/\s/g, "")))
    .sort()
    .join("");
  if (!chars) return null;

  const cached = cache.get(chars);
  if (cached !== undefined) return cached;

  try {
    const cssUrl =
      "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@700&text=" +
      encodeURIComponent(chars);
    const cssRes = await fetch(cssUrl, {
      headers: { "User-Agent": LEGACY_UA },
      next: { revalidate: 31536000 },
    });
    if (!cssRes.ok) throw new Error(`font css ${cssRes.status}`);

    const css = await cssRes.text();
    const url = css.match(/src:\s*url\(([^)]+)\)/)?.[1];
    if (!url) throw new Error("no font url in css");

    const fontRes = await fetch(url, { next: { revalidate: 31536000 } });
    if (!fontRes.ok) throw new Error(`font ${fontRes.status}`);

    const buf = await fontRes.arrayBuffer();
    cache.set(chars, buf);
    return buf;
  } catch {
    /* 字型抓不到就回 null，由 renderOg 退成純拉丁版面。這段是在 next build 期間
       執行的，讓它 throw 會直接讓部署失敗——為了一張分享圖不值得。 */
    cache.set(chars, null);
    return null;
  }
}
