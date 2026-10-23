import { PROJECTS } from "../../../data";
import { getAllRepoInfo } from "../../../lib/github";
import { shieldBadge, svgResponse } from "../../../lib/badge";
import { unavailable } from "../../../template/availability";

// Total stars for configured project repositories.
// 把 data.ts 全部專案 repo 的 stargazers_count 加總。

export const revalidate = 3600;

export async function GET() {
  const disabled = unavailable("github");
  if (disabled) return disabled;
  let stars = 0;
  const infos = await getAllRepoInfo(PROJECTS);
  for (const info of Object.values(infos)) {
    if (info) stars += info.stars;
  }
  return svgResponse(
    shieldBadge("github stars", String(stars), "#4078c0"),
    3600
  );
}
