/** Edit these sample categories to showcase your own interests. */
export interface Like {
  title: string;
  sub?: string;
  cover?: string;
  href?: string;
  personRating?: number;
  tags?: string[];
  note?: string;
  channelId?: string;
}

export interface LikeCategory {
  key: string;
  label: string;
  en: string;
  layout?: "circle";
  items: Like[];
}

export const LIKE_CATEGORIES: LikeCategory[] = [
  {
    key: "novel",
    label: "閱讀",
    en: "READING",
    items: [
      {
        title: "閱讀清單範例",
        sub: "作者名稱",
        cover: "/assets/template/banner.svg",
        tags: ["閱讀"],
        note: "在這裡寫下你喜歡這本書的原因。",
        personRating: 4.5,
      },
    ],
  },
  {
    key: "anime",
    label: "影視",
    en: "WATCHING",
    items: [
      {
        title: "影視收藏範例",
        sub: "創作者名稱",
        cover: "/assets/template/banner.svg",
        note: "這是示範卡片，替換成你想介紹的作品。",
        personRating: 4.5,
      },
    ],
  },
];
