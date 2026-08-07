"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* Inner 會把整個 data.ts（PROJECTS + LIKE_CATEGORIES + LINKS + EXPERIENCE，約 58KB）
   拉進 client bundle 來建搜尋索引。它掛在 layout 底下，所以那 58KB 本來是每條路由
   都要載的——但面板在按下 Cmd+K 之前根本不會渲染，動態載入剛好對得上。 */
const CommandPaletteInner = dynamic(() => import("./CommandPaletteInner"), {
  ssr: false,
});

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpenEvent);
    };
  }, []);

  if (!open) return null;
  return <CommandPaletteInner onClose={() => setOpen(false)} />;
}
