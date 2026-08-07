import { DISCORD_USER_ID } from "../../../siteConfig";
import { shieldBadge, svgResponse } from "../../../lib/badge";

// Discord 狀態徽章：https://itousouta.me/api/badge/discord.svg
// 掛在 README 會顯示目前上線/閒置/勿擾/離線。狀態常變，快取壓短。

export const revalidate = 60;

const STATUS_LABEL: Record<string, string> = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

const STATUS_COLOR: Record<string, string> = {
  online: "#3ba55d",
  idle: "#faa61a",
  dnd: "#ed4245",
  offline: "#747f8d",
};

export async function GET() {
  let status = "offline";
  try {
    const res = await fetch(
      `https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`,
      { next: { revalidate: 60 } }
    );
    if (res.ok) {
      const json = await res.json();
      const s = json?.data?.discord_status;
      if (typeof s === "string" && STATUS_COLOR[s]) status = s;
    }
  } catch {
    /* 拿不到就當離線 */
  }

  return svgResponse(
    shieldBadge("discord", STATUS_LABEL[status], STATUS_COLOR[status]),
    60
  );
}
