"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const CommandPaletteInner = dynamic(() => import("./CommandPaletteInner"), { ssr: false });

export default function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(o => !o);
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
