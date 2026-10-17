export const NAV_LINKS = [
  { label: "關於", href: "/about" },
  { label: "收藏", href: "/likes" },
  { label: "專案", href: "/projects" },
  { label: "文章", href: "/writing" },
  { label: "友鏈", href: "/links" },
  { label: "經歷", href: "/experience" },
];

export function nextChapter(pathname: string) {
  const index = NAV_LINKS.findIndex(
    ({ href }) => pathname === href || pathname.startsWith(`${href}/`)
  );
  return index >= 0 ? NAV_LINKS[index + 1] : undefined;
}

export function chapterBackLink(pathname: string) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const parent = NAV_LINKS.find(({ href }) =>
    normalized.startsWith(`${href}/`)
  );
  return parent
    ? { href: parent.href, label: parent.label, caption: "回到上一頁" }
    : { href: "/", label: "首頁", caption: "返回首頁" };
}
