import type { ContributionCell } from "./contributions";

export interface SnakePoint {
  x: number;
  y: number;
}
const key = ({ x, y }: SnakePoint) => `${x},${y}`;
const directions = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
];

/** Shortest path to the nearest uneaten cell, avoiding the snake's body.
 * One empty-cell border gives it room to turn around at calendar edges. */
export function createContributionRoute(cells: ContributionCell[]) {
  const remaining = new Set(cells.filter((c) => c.count > 0).map(key));
  const visits = new Map<string, number>();
  const points: SnakePoint[] = [];
  if (!remaining.size) return { points, visits };
  const columns = Math.max(3, Math.max(...cells.map((c) => c.x)) + 1);
  const first = cells.find((c) => c.count > 0)!;
  const start = { x: Math.max(2, first.x), y: -1 };
  let body = [
    start,
    { x: start.x - 1, y: -1 },
    { x: start.x - 2, y: -1 },
    { x: start.x - 3, y: -1 },
  ];
  points.push(start);

  const findPath = (
    targets: Set<string>,
    avoid: SnakePoint[] = []
  ): SnakePoint[] | null => {
    const blocked = new Set([...body.slice(1, -1), ...avoid].map(key));
    const queue = [body[0]];
    const previous = new Map<string, SnakePoint | null>([[key(body[0]), null]]);
    for (let i = 0; i < queue.length; i++) {
      const point = queue[i];
      if (i > 0 && targets.has(key(point))) {
        const path: SnakePoint[] = [];
        let current: SnakePoint | null = point;
        while (current && previous.get(key(current)) !== null) {
          path.push(current);
          current = previous.get(key(current))!;
        }
        return path.reverse();
      }
      for (const d of directions) {
        const next = { x: point.x + d.x, y: point.y + d.y };
        const id = key(next);
        if (
          next.x < -1 ||
          next.x > columns ||
          next.y < -1 ||
          next.y > 7 ||
          blocked.has(id) ||
          previous.has(id)
        )
          continue;
        previous.set(id, point);
        queue.push(next);
      }
    }
    return null;
  };
  const follow = (path: SnakePoint[]) => {
    for (const point of path) {
      body = [point, ...body.slice(0, 3)];
      points.push(point);
      if (remaining.delete(key(point)))
        visits.set(key(point), points.length - 1);
    }
  };
  while (remaining.size) {
    const path = findPath(remaining);
    if (!path) break;
    follow(path);
  }
  // Dock from the same direction as the initial body. The final three cells
  // are reserved while returning so the loop also avoids self-collisions.
  const approach = [3, 2, 1, 0].map((offset) => ({
    x: start.x - offset,
    y: -1,
  }));
  const home = findPath(new Set([key(approach[0])]), approach.slice(1));
  if (home) {
    follow(home);
    follow(approach.slice(1));
  }
  return { points, visits };
}
