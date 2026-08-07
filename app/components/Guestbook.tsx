"use client";

import { useEffect, useRef } from "react";
import { init, type WalineInstance } from "@waline/client";
import "@waline/client/style";
import { useTheme } from "./ThemeProvider";

/* 留言板後端複用部落格（itouBLoGa）已部署的 Waline 伺服器，零新基礎設施。
   path 固定 /guestbook，跟部落格的文章留言各自獨立成區。 */
const SERVER_URL = "https://web-eight-weld-65.vercel.app";

export default function Guestbook() {
  const { theme } = useTheme();
  const ref = useRef<HTMLDivElement>(null);
  const walineRef = useRef<WalineInstance | null>(null);

  useEffect(() => {
    if (!ref.current || walineRef.current) return;
    walineRef.current = init({
      el: ref.current,
      serverURL: SERVER_URL,
      path: "/guestbook",
      lang: "zh-TW",
      dark: theme === "dark",
    });
    return () => {
      walineRef.current?.destroy?.();
      walineRef.current = null;
    };
    // 只在掛載時 init 一次；主題切換走下面的 update
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    walineRef.current?.update?.({ dark: theme === "dark" });
  }, [theme]);

  return <div ref={ref} className="guestbook-waline" />;
}
