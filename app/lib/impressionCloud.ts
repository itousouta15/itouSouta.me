import type { VisitorImpression } from "./impressions";

export interface CloudWord extends VisitorImpression {
  x: number;
  y: number;
  size: number;
  angle: number;
  color: number;
}

interface WordBox {
  x: number;
  y: number;
  halfWidth: number;
  halfHeight: number;
  cos: number;
  sin: number;
  extentX: number;
  extentY: number;
}

// Keep this in sync with .impressions-word's line-height. The padding is the
// complete gap between words, rather than a large axis-aligned safety margin.
const LINE_HEIGHT = 1.1;
const WORD_GAP = 3;
const EDGE = 6;
const ATTEMPTS = 2000;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Separating axes of the actual rotated rectangles, so the empty corners of
 * a tilted word's axis-aligned bounding box can hold another word. */
function overlaps(a: WordBox, b: WordBox): boolean {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (
    Math.abs(dx) >= a.extentX + b.extentX ||
    Math.abs(dy) >= a.extentY + b.extentY
  )
    return false;
  const parallel = Math.abs(a.cos * b.cos + a.sin * b.sin);
  const perpendicular = Math.abs(a.cos * b.sin - a.sin * b.cos);
  return !(
    Math.abs(dx * a.cos + dy * a.sin) >=
      a.halfWidth + b.halfWidth * parallel + b.halfHeight * perpendicular ||
    Math.abs(-dx * a.sin + dy * a.cos) >=
      a.halfHeight + b.halfWidth * perpendicular + b.halfHeight * parallel ||
    Math.abs(dx * b.cos + dy * b.sin) >=
      b.halfWidth + a.halfWidth * parallel + a.halfHeight * perpendicular ||
    Math.abs(-dx * b.sin + dy * b.cos) >=
      b.halfHeight + a.halfWidth * perpendicular + a.halfHeight * parallel
  );
}

/** A shared-center, fine-grained spiral packs words into a compact cluster.
 * Recomputed only on data/font/size changes; no continuous layout animation. */
export function layoutImpressionCloud(
  items: VisitorImpression[],
  width: number,
  height: number,
  seed: number,
  measure: (text: string, size: number) => number,
  latest: string | null
): CloudWord[] {
  if (!items.length || width <= EDGE * 2 || height <= EDGE * 2) return [];
  let state = seed;
  const random = () => {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const shuffled = items.map((item) => ({ ...item, order: random() }));
  shuffled.sort((a, b) =>
    a.tag === latest
      ? -1
      : b.tag === latest
        ? 1
        : b.count - a.count || a.order - b.order
  );
  const max = Math.max(1, ...items.map((item) => item.count));
  const min = Math.max(1, Math.min(...items.map((item) => item.count)));
  const minSize = width < 360 ? 16 : 18;
  const maxSize = width < 360 ? 34 : 46;
  const minimum = width < 360 ? 12 : 14;
  const fontSize = (count: number) => {
    const weight =
      max > min
        ? (Math.log1p(count) - Math.log1p(min)) /
          (Math.log1p(max) - Math.log1p(min))
        : 0.45;
    return minSize + weight * (maxSize - minSize);
  };
  const textArea = items.reduce((area, item) => {
    const size = fontSize(item.count);
    return area + measure(item.tag, size) * size * LINE_HEIGHT;
  }, 0);
  // Scale the whole set before placing the largest words. Otherwise a handful
  // of large labels can consume a mobile cloud before the smaller ones fit.
  const densityScale = Math.min(
    1,
    Math.sqrt((width * height * 0.42) / Math.max(1, textArea))
  );
  const boxes: WordBox[] = [];
  const placed: CloudWord[] = [];

  for (const item of shuffled) {
    let initialSize = Math.max(minimum, fontSize(item.count) * densityScale);
    const measured = Math.max(1, measure(item.tag, initialSize));
    initialSize *= Math.min(
      1,
      (width - EDGE * 2 - WORD_GAP) / measured,
      (height - EDGE * 2 - WORD_GAP) / (initialSize * LINE_HEIGHT)
    );
    // Wide phrases stay horizontal, avoiding a large tilted strip of empty
    // space. Short words retain the reference's -15 / 0 / 15 degree variation.
    const angle =
      measured > width * 0.55
        ? 0
        : [0, 0, 0, -15, 15][Math.floor(random() * 5)];
    const radians = (angle * Math.PI) / 180;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);
    const phase = random() * Math.PI * 2;
    const smallest = Math.min(initialSize, minimum);
    const sizes = [
      ...new Set([
        initialSize,
        Math.max(smallest, initialSize * 0.85),
        Math.max(smallest, initialSize * 0.7),
        smallest,
      ]),
    ];
    let found = false;

    for (const size of sizes) {
      const halfWidth = (measure(item.tag, size) + WORD_GAP) / 2;
      const halfHeight = (size * LINE_HEIGHT + WORD_GAP) / 2;
      const extentX = Math.abs(halfWidth * cos) + Math.abs(halfHeight * sin);
      const extentY = Math.abs(halfWidth * sin) + Math.abs(halfHeight * cos);
      if (extentX * 2 > width - EDGE * 2 || extentY * 2 > height - EDGE * 2)
        continue;

      for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
        const radius = Math.sqrt(attempt / (ATTEMPTS - 1));
        const turn = phase + attempt * GOLDEN_ANGLE;
        const x = width / 2 + Math.cos(turn) * radius * (width / 2 - EDGE);
        const y = height / 2 + Math.sin(turn) * radius * (height / 2 - EDGE);
        if (
          x - extentX < EDGE ||
          x + extentX > width - EDGE ||
          y - extentY < EDGE ||
          y + extentY > height - EDGE
        )
          continue;
        const box: WordBox = {
          x,
          y,
          halfWidth,
          halfHeight,
          cos,
          sin,
          extentX,
          extentY,
        };
        if (boxes.some((other) => overlaps(box, other))) continue;
        boxes.push(box);
        placed.push({
          tag: item.tag,
          count: item.count,
          x,
          y,
          size,
          angle,
          color: Math.floor(random() * 4),
        });
        found = true;
        break;
      }
      if (found) break;
    }
  }
  // Center the packed cluster itself, rather than leaving extra empty space on
  // one side when a few long phrases push the occupied area off the origin.
  if (boxes.length) {
    const left = Math.min(...boxes.map((box) => box.x - box.extentX));
    const right = Math.max(...boxes.map((box) => box.x + box.extentX));
    const top = Math.min(...boxes.map((box) => box.y - box.extentY));
    const bottom = Math.max(...boxes.map((box) => box.y + box.extentY));
    const dx = (width - left - right) / 2;
    const dy = (height - top - bottom) / 2;
    for (const word of placed) {
      word.x += dx;
      word.y += dy;
    }
  }
  return placed;
}
