"use client";

import { useId, useMemo, useRef, useState } from "react";
import {
  contributionCells,
  contributionLabel,
  type ContributionDay,
} from "../../lib/contributions";
import { createContributionRoute } from "../../lib/contributionSnake";

export default function ContributionCalendar({
  days,
}: {
  days: ContributionDay[];
}) {
  const id = `contribution-${useId().replace(/[^a-z0-9]/gi, "")}`;
  const cells = useMemo(() => contributionCells(days), [days]);
  const [selected, setSelected] = useState<ContributionDay | null>(null);
  const [focusIndex, setFocusIndex] = useState(days.length - 1);
  const rects = useRef<(SVGRectElement | null)[]>([]);
  const width = Math.max(3, cells[cells.length - 1].x + 1) * 16;
  const total = days.reduce((sum, day) => sum + day.count, 0);
  const motion = useMemo(() => {
    const { points, visits } = createContributionRoute(cells);
    if (points.length < 2) return null;
    const steps = points.length - 1;
    const percent = (step: number) => `${((step / steps) * 100).toFixed(5)}%`;
    let css = `@keyframes ${id}-move{${points.map((p, i) => `${percent(i)}{transform:translate(${p.x * 16}px,${p.y * 16}px)}`).join("")}}`;
    let collected = 0;
    let bar = "";
    const food = cells
      .filter((c) => visits.has(`${c.x},${c.y}`))
      .sort(
        (a, b) => visits.get(`${a.x},${a.y}`)! - visits.get(`${b.x},${b.y}`)!
      );
    for (const cell of food) {
      const step = visits.get(`${cell.x},${cell.y}`)!;
      css += `@keyframes ${id}-eat-${step}{0%,${percent(step - 0.01)}{fill:var(--gh-color)}${percent(step)},100%{fill:var(--gh-0)}}`;
      bar += `${percent(step - 0.01)}{transform:scaleX(${collected / total})}`;
      collected += cell.count;
      bar += `${percent(step)}{transform:scaleX(${collected / total})}`;
    }
    css += `@keyframes ${id}-collect{0%{transform:scaleX(0)}${bar}100%{transform:scaleX(${collected / total})}}`;
    return { css, visits, duration: steps * 0.1, start: points[0] };
  }, [cells, id, total]);
  const summary = `最近一年 ${total.toLocaleString("zh-TW")} 次貢獻`;
  return (
    <>
      <p className="sr-only" id={`${id}-help`}>
        以左右方向鍵移動一週，上下方向鍵移動一天；Home、End
        跳到第一天或最後一天。
      </p>
      <div
        className="github-calendar-scroll"
        data-lenis-prevent-wheel
        onPointerLeave={() => setSelected(null)}
      >
        <svg
          className="github-calendar"
          viewBox={`-24 -32 ${width + 48} 202`}
          role="group"
          aria-label={`${summary}，${days[0].date} 至 ${days[days.length - 1].date}`}
          aria-describedby={`${id}-help`}
        >
          {motion && <style>{motion.css}</style>}
          {cells.map((cell, i) => {
            const step = motion?.visits.get(`${cell.x},${cell.y}`);
            return (
              <rect
                key={cell.date}
                ref={(el) => {
                  rects.current[i] = el;
                }}
                x={cell.x * 16}
                y={cell.y * 16}
                width={12}
                height={12}
                rx={2}
                className={`github-day github-level-${cell.level}`}
                role="button"
                aria-label={contributionLabel(cell)}
                tabIndex={i === focusIndex ? 0 : -1}
                style={
                  step != null && motion
                    ? {
                        animationName: `${id}-eat-${step}`,
                        animationDuration: `${motion.duration}s`,
                      }
                    : undefined
                }
                onPointerEnter={() => setSelected(cell)}
                onClick={() => {
                  setFocusIndex(i);
                  setSelected(cell);
                  rects.current[i]?.focus({ preventScroll: true });
                }}
                onFocus={() => {
                  setFocusIndex(i);
                  setSelected(cell);
                }}
                onBlur={() => setSelected(null)}
                onKeyDown={(event) => {
                  const offsets: Record<string, number> = {
                    ArrowLeft: -7,
                    ArrowRight: 7,
                    ArrowUp: -1,
                    ArrowDown: 1,
                  };
                  let next = i;
                  if (event.key in offsets)
                    next = Math.max(
                      0,
                      Math.min(cells.length - 1, i + offsets[event.key])
                    );
                  else if (event.key === "Home") next = 0;
                  else if (event.key === "End") next = cells.length - 1;
                  else if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setSelected(cell);
                    return;
                  } else return;
                  event.preventDefault();
                  rects.current[next]?.focus({ preventScroll: true });
                  rects.current[next]?.scrollIntoView({
                    block: "nearest",
                    inline: "nearest",
                  });
                }}
              >
                <title>{contributionLabel(cell)}</title>
              </rect>
            );
          })}
          {motion && (
            <g
              className="github-snake-decoration"
              aria-hidden="true"
              pointerEvents="none"
            >
              <rect
                className="github-snake-track"
                x={0}
                y={144}
                width={width - 4}
                height={6}
                rx={2}
              />
              <rect
                className="github-snake-progress"
                x={0}
                y={144}
                width={width - 4}
                height={6}
                rx={2}
                style={{
                  animationName: `${id}-collect`,
                  animationDuration: `${motion.duration}s`,
                }}
              />
              {[3, 2, 1, 0].map((segment) => (
                <rect
                  key={segment}
                  className="github-snake"
                  x={-1}
                  y={-1}
                  width={14 - segment}
                  height={14 - segment}
                  rx={4}
                  style={{
                    animationName: `${id}-move`,
                    animationDuration: `${motion.duration}s`,
                    animationDelay: `${-motion.duration + segment * 0.1}s`,
                    transform: `translate(${motion.start.x * 16}px,${motion.start.y * 16}px)`,
                    opacity: 1 - segment * 0.15,
                  }}
                />
              ))}
            </g>
          )}
        </svg>
      </div>
      <div className="github-calendar-footer">
        <span role="status" aria-live="polite">
          {selected ? contributionLabel(selected) : summary}
        </span>
        <span
          className="github-legend"
          aria-label="顏色由淺至深表示貢獻次數由少至多"
        >
          少
          {[0, 1, 2, 3, 4].map((level) => (
            <i key={level} className={`github-level-${level}`} />
          ))}
          多
        </span>
      </div>
    </>
  );
}
