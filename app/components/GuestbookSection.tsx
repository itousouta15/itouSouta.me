"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";

/* Waline 的 bundle 約 77KB，全站每頁都掛會直接把每頁的 JS 翻倍。
   用 IntersectionObserver 等滾到頁底附近才真的載入（rootMargin 400px 提早預熱），
   沒滾到就不載。 */
const Guestbook = dynamic(() => import("./Guestbook"), { ssr: false });

export default function GuestbookSection() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (pathname === "/") return;
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

  // 首頁不放留言板
  if (pathname === "/") return null;

  return (
    <div ref={ref} className="guestbook-section">
      <div className="card-kicker">GUESTBOOK</div>
      <div className="divider" />
      {shown && <Guestbook />}
    </div>
  );
}
