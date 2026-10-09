import type { VisitorImpression } from "./impressions";

export interface CloudWord extends VisitorImpression {
  x: number;
  y: number;
  size: number;
  angle: number;
  color: number;
}

/* 只在資料／區塊尺寸變更時計算。文字位置用隨機起點的橢圓螺旋找空隙，
   旋轉後的包圍盒也參與碰撞檢查，不靠持續動畫移動文字。 */
export function layoutImpressionCloud(
  items: VisitorImpression[],
  width: number,
  height: number,
  seed: number,
  measure: (text: string, size: number) => number,
  latest: string | null
): CloudWord[] {
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
  const boxes: { left: number; top: number; right: number; bottom: number }[] =
    [];
  const placed: CloudWord[] = [];
  const maxSize = width < 360 ? 28 : 38;
  for (const item of shuffled) {
    const weight = max > 1 ? Math.log1p(item.count) / Math.log1p(max) : 0.4;
    let size = 14 + weight * (maxSize - 14);
    const measured = measure(item.tag, size);
    size *= Math.min(1, (width - 24) / Math.max(1, measured));
    const angle = (Math.floor(random() * 5) - 2) * 7;
    const radians = (angle * Math.PI) / 180;
    const textWidth = measure(item.tag, size);
    const textHeight = size * 1.3;
    const boxWidth =
      Math.abs(textWidth * Math.cos(radians)) +
      Math.abs(textHeight * Math.sin(radians)) +
      10;
    const boxHeight =
      Math.abs(textWidth * Math.sin(radians)) +
      Math.abs(textHeight * Math.cos(radians)) +
      10;
    const phase = random() * Math.PI * 2;
    const originX = width * (0.4 + random() * 0.2);
    const originY = height * (0.4 + random() * 0.2);
    for (let attempt = 0; attempt < 600; attempt++) {
      const radius = Math.sqrt(attempt / 600) * Math.max(width, height) * 0.7;
      const turn = phase + attempt * 0.45;
      const x = originX + Math.cos(turn) * radius;
      const y = originY + (Math.sin(turn) * radius * height) / width;
      const box = {
        left: x - boxWidth / 2,
        top: y - boxHeight / 2,
        right: x + boxWidth / 2,
        bottom: y + boxHeight / 2,
      };
      if (
        box.left < 4 ||
        box.top < 14 ||
        box.right > width - 4 ||
        box.bottom > height - 14
      )
        continue;
      if (
        boxes.some(
          (other) =>
            box.left < other.right &&
            box.right > other.left &&
            box.top < other.bottom &&
            box.bottom > other.top
        )
      )
        continue;
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
      break;
    }
  }
  return placed;
}
