"use client";
import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

interface ThemeCtxValue {
  theme: "dark" | "light";
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({ theme: "dark", toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

const STORAGE_KEY = "theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR renders dark; the inline head script already applied the saved theme to
  // <html> before paint, so there is no flash. We adopt it after hydration.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const ready = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  // Apply + persist on change. Skip the very first run so we don't overwrite
  // the value the head script set before React mounted.
  useEffect(() => {
    if (!ready.current) {
      ready.current = true;
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => (t === "dark" ? "light" : "dark")) }}>
      <div className="root">{children}</div>
    </ThemeCtx.Provider>
  );
}
