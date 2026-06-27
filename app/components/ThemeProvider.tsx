"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface ThemeCtxValue {
  theme: "dark" | "light";
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({ theme: "dark", toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme(t => t === "dark" ? "light" : "dark") }}>
      <div className="root" data-theme={theme}>{children}</div>
    </ThemeCtx.Provider>
  );
}
