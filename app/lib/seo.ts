import type { Metadata } from "next";
import { site } from "../template/config";

export const SITE_URL = site.url;
export const SITE_TITLE = site.title;
export const SHARE_IMAGE = {
  url: site.shareImage,
  width: 768,
  height: 432,
  alt: `${site.title} 分享圖片`,
};

/* The description is shared by the homepage metadata and social previews. */
export const SITE_DESCRIPTION = site.description;

interface PageMetaInput {
  /** Page title, combined with the configured site title in the layout. */
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
      locale: site.openGraphLocale,
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
