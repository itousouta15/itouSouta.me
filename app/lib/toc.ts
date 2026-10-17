export interface HeadingPosition {
  id: string;
  top: number;
}

/** Positions are measured only when content changes; scrolling uses a binary
 * search and causes a React update only when the current section changes. */
export function activeHeadingAt(
  positions: HeadingPosition[],
  marker: number
): string | null {
  if (!positions.length) return null;
  let low = 0;
  let high = positions.length - 1;
  let selected = 0;
  while (low <= high) {
    const middle = (low + high) >>> 1;
    if (positions[middle].top <= marker) {
      selected = middle;
      low = middle + 1;
    } else high = middle - 1;
  }
  return positions[selected].id;
}
