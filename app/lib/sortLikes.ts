import type { Like } from "../data";

const score = (l: Like) => l.rating ?? l.personRating;

/**
 * Sort by rating (falls back to personRating). Items without either always
 * sink to the end, regardless of direction, instead of clustering at the top.
 *
 * `isLive`, when given, takes priority over rating: live items always sort
 * before non-live ones, and rating only breaks ties within each group.
 */
export function sortLikesByRating(
  items: Like[],
  direction: "desc" | "asc" = "desc",
  isLive?: (l: Like) => boolean
): Like[] {
  return [...items].sort((a, b) => {
    if (isLive) {
      const la = isLive(a);
      const lb = isLive(b);
      if (la !== lb) return la ? -1 : 1;
    }
    const sa = score(a);
    const sb = score(b);
    if (sa == null && sb == null) return 0;
    if (sa == null) return 1;
    if (sb == null) return -1;
    return direction === "desc" ? sb - sa : sa - sb;
  });
}
