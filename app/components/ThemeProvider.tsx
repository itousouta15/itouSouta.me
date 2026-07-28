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
  glass: boolean;
  glassCapable: boolean;
  toggleGlass: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  theme: "dark",
  toggle: () => {},
  glass: false,
  glassCapable: false,
  toggleGlass: () => {},
});
export const useTheme = () => useContext(ThemeCtx);

const STORAGE_KEY = "theme";
const GLASS_STORAGE_KEY = "glass";
// Same Firefox-family check as the blocking script in layout.tsx — Zen is a
// Firefox fork that deliberately keeps navigator.userAgent identical to real
// Firefox's, so this is the closest available proxy for "could be Zen".
const isFirefoxFamilyUA = () =>
  /firefox\//i.test(navigator.userAgent) && !/seamonkey\//i.test(navigator.userAgent);

export default function ThemeProvider({ children }: { children: ReactNode }) {
  // SSR renders dark/non-glass; the inline head script already applied the
  // resolved data-theme/data-glass to <html> before paint (using the same UA
  // check + any saved glass override), so there is no flash. We adopt both
  // into state after hydration.
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [glass, setGlass] = useState(false);
  const [glassCapable, setGlassCapable] = useState(false);
  const ready = useRef(false);
  const glassReady = useRef(false);

  useEffect(() => {
    const isGlass = document.documentElement.getAttribute("data-glass") === "on";
    setGlass(isGlass);
    setGlassCapable(isFirefoxFamilyUA());
    // Glass forces dark (the head script already set that before paint) —
    // only restore a saved light/dark preference when glass isn't forcing it.
    if (!isGlass) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") setTheme(saved);
    }
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

  useEffect(() => {
    if (!glassReady.current) {
      glassReady.current = true;
      return;
    }
    document.documentElement.setAttribute("data-glass", glass ? "on" : "off");
    localStorage.setItem(GLASS_STORAGE_KEY, glass ? "on" : "off");
    // Turning glass back on re-forces dark, same as the initial auto-detect —
    // the translucent tokens are only tuned for dark.
    if (glass) setTheme("dark");
  }, [glass]);

  return (
    <ThemeCtx.Provider
      value={{
        theme,
        toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
        glass,
        glassCapable,
        toggleGlass: () => setGlass((g) => !g),
      }}
    >
      <div className="root">{children}</div>
    </ThemeCtx.Provider>
  );
}
