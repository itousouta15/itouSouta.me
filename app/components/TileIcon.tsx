"use client";

import { useTheme } from "./ThemeProvider";
import { TILE_ICON_META } from "./tileIconMeta";

export default function TileIcon({ kind }: { kind: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const icon = TILE_ICON_META[kind];

  if (!icon) {
    return null;
  }

  const bg = isDark ? icon.bg : icon.bgLight;
  const imgFilter = isDark ? icon.filter : undefined;

  return (
    <div
      title={icon.label}
      style={{
        position: "absolute",
        inset: 0,
        background: bg,
        borderRadius: "inherit",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: "52px",
          height: "52px",
          backgroundImage: `url("${icon.src}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
          filter: imgFilter,
        }}
      />
    </div>
  );
}
