export interface LinkItem {
  name: string;
  handle: string;
  href: string;
  desc?: string;
  avatar?: string;
}

export const LINKS: LinkItem[] = [
  {
    name: "範例友站",
    handle: "example.com",
    href: "https://example.com",
    desc: "把這裡改成你想推薦的朋友或網站。",
    avatar: "/assets/template/avatar.svg",
  },
];
