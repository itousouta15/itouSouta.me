import type { Metadata } from "next";

export const SITE_URL = "https://itousouta.me";
export const SITE_TITLE = "itouSouta.me";
export const SHARE_IMAGE = {
  url: "/assets/brand/banner-og.png",
  width: 768,
  height: 432,
  alt: "伊藤蒼太的網站背景插畫",
};

/* 描述是給 Google 抓 snippet 用的，不是給我自顧自賣萌用的。太短或整串只有顏文字
   的話，Google 會直接無視 meta description、改成自己從 DOM 撈文字拼一段——首頁
   之前就是這樣被拼出「itouSouta伊藤蒼太郭家睿itouSouta...= ᗜ ω ᗜ.=」那串亂碼。
   所以每一頁的描述都要「前面放實話、顏文字擺句尾」：搜尋結果大概只會顯示前
   70～80 個中文字，關鍵字塞在前面才吃得到，尾巴被截掉也不心疼。 */
export const SITE_DESCRIPTION =
  "itouSouta / 伊藤蒼太 / 郭家睿的個人網站。臺中市立大里高中學生、SCAICT 中部高中電資社團聯合會議第五屆會長，喜歡 VOCALOID、畫插畫和寫程式。這裡放著我的專案、經歷、文章與喜歡的東西 ε(*´･∀･｀)зﾞ";

interface PageMetaInput {
  /** 分頁標題，會套 layout 的 `%s | itouSouta.me` 模板 */
  title: string;
  description: string;
  /** 站內路徑，`/about` 這種。同時當 canonical 與 og:url */
  path: string;
  /** 首頁用：title 就是整串 <title>，不要再套模板黏一次站名 */
  absolute?: boolean;
}

/* Next.js 的 metadata 只有「最外層欄位」會沿著 layout → page 合併，openGraph 與
   twitter 這種巢狀物件是整包覆蓋掉的。先前每一頁各自寫 `openGraph: { title,
   description, url }`，等於把 layout 設好的 type / locale / siteName 全砍光，
    twitter 那邊更慘——card 從 summary_large_image 掉回 summary，分享出去變成右邊
    一小格縮圖。所以統一從這裡產生，每頁只填自己不一樣的那三個欄位。 */
export function pageMetadata({
  title,
  description,
  path,
  absolute,
}: PageMetaInput): Metadata {
  const shareTitle = absolute ? title : `${title} | ${SITE_TITLE}`;

  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "zh_TW",
      siteName: SITE_TITLE,
      url: path,
      title: shareTitle,
      description,
      images: [SHARE_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [SHARE_IMAGE],
    },
  };
}
