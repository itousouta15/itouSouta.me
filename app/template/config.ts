/** Public, serializable settings. Edit this file first when creating your site. */
export const site = {
  url: "https://example.com",
  title: "My Corner",
  shortName: "My Corner",
  description: "作品、文章與生活紀錄，收在自己的小角落。",
  locale: "zh-Hant",
  openGraphLocale: "zh_TW",
  author: {
    name: "小角",
    aliases: ["Corner"],
    handle: "@corner",
    introduction: "喜歡設計、寫程式，也喜歡分享學到的事。",
    about: [
      "你好，我是小角。這個網站用來整理做過的作品與最近的想法。",
      "你可以從專案、文章或收藏開始逛，也歡迎透過下方連結與我聯絡。",
    ],
    birthday: "2000/01/01",
    joined: "2020/01/01",
  },
  quote: "把喜歡的事，慢慢做好。",
  greeting: "你好，歡迎來到我的小角落！",
  avatar: "/assets/template/avatar.svg",
  banner: "/assets/template/banner.svg",
  shareImage: "/assets/template/banner.svg",
  copyrightYear: new Date().getFullYear(),
  socials: [] as { icon: string; label: string; href: string }[],
  featuredLinks: [] as { label: string; href: string }[],
  /** These IDs may be sent to browsers. Never put service tokens here. */
  githubUsername: "",
  discordUserId: "",
  /** Only true modules are shown or queried. Credentials stay in .env.local. */
  features: {
    github: false,
    discord: false,
    spotify: false,
    threads: false,
    liveThoughts: false,
    guestbook: false,
    impressions: false,
    reactions: false,
    vtuberLive: false,
    visitorCounter: false,
    publicApi: false,
  },
} as const;

export const features = site.features;
