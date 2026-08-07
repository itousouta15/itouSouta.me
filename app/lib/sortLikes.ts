import type { Like } from "../data";

/**
 * Sort by `personRating`. Items without one always sink to the end, regardless
 * of direction, instead of clustering at the top.
 *
 * `isLive`, when given, takes priority over the rating: live items always sort
 * before non-live ones, and the rating only breaks ties within each group.
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
    const sa = a.personRating;
    const sb = b.personRating;
    if (sa == null && sb == null) return 0;
    if (sa == null) return 1;
    if (sb == null) return -1;
    return direction === "desc" ? sb - sa : sa - sb;
  });
}
