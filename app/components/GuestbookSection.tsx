"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

/* Waline 的 bundle 約 77KB，全站每頁都掛會直接把每頁的 JS 翻倍。
   用 IntersectionObserver 等滾到頁底附近才真的載入（rootMargin 400px 提早預熱），
   沒滾到就不載。 */
const Guestbook = dynamic(() => import("./Guestbook"), { ssr: false });

/* 只有這些真實頁面才放留言板；404／不存在的路徑雖然也會走 root layout，
   但不該冒出留言區。新頁面要加留言板記得補進來。 */
const GUESTBOOK_PATHS = new Set([
  "/about",
  "/blog",
  "/writing",
  "/thoughts",
  "/projects",
  "/likes",
  "/likes/music",
  "/likes/novel",
  "/likes/manga",
  "/likes/anime",
  "/likes/vtuber",
  "/links",
  "/experience",
  "/offline",
  "/api",
]);

export default function GuestbookSection() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (!GUESTBOOK_PATHS.has(pathname)) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pathname]);

  // 首頁或不是真實頁面的路徑（例如 404）都不放留言板
  if (!GUESTBOOK_PATHS.has(pathname)) return null;

  return (
    <div ref={ref} className="guestbook-section">
      <div className="card-kicker">GUESTBOOK</div>
      <div className="divider" />
      {/* 還沒載入前先佔住高度，避免 Guestbook 進場時把頁尾往下推 */}
      {shown ? (
        <Guestbook path={pathname} />
      ) : (
        <div className="guestbook-placeholder" />
      )}
    </div>
  );
}
