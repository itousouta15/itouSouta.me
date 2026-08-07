"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";

interface ThemeCtxValue {
  theme: "dark" | "light";
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "dark",
  toggle: () => {},
});
export const useTheme = () => useContext(ThemeCtx);

const STORAGE_KEY = "theme";

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR 渲染 dark；layout.tsx 的 blocking script 已在繪製前把儲存的
  // data-theme 寫到 <html>，所以沒有閃爍，hydrate 後再收進 state。
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
    <ThemeCtx.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
      }}
    >
      <div className="root">{children}</div>
    </ThemeCtx.Provider>
  );
}
