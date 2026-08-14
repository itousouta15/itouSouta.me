"use client";

import { useEffect, useRef, useState } from "react";
import { ExperienceItem } from "../data";
import ProjectModalShell from "./ProjectModalShell";
import ExperienceDetailBody from "./ExperienceDetailBody";

interface Props {
  groups: [string, ExperienceItem[]][];
}

/* 讓時間軸「跟著目前捲動到的區域」動：卡在畫面上方 40% 那條線之上的項目算
   「已經過去」（連接線與圓點轉為實色），正好壓在那條線上的算「現在」（圓點
   有脈動光圈），還沒捲到的維持原本的灰階樣式。用 [data-scroll-progress="on"]
   包住所有變色規則，效果只在這個 effect 真的跑起來（非 reduced-motion）之後
   才會生效，沒有 JS 或使用者要求減少動態效果時，畫面維持跟現在完全一樣。 */
export default function ExperienceTimeline({ groups }: Props) {
  const timelineEls = useRef<Set<HTMLDivElement>>(new Set());
  const rowEls = useRef<Set<HTMLDivElement>>(new Set());
  const [activeItem, setActiveItem] = useState<ExperienceItem | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timelines = [...timelineEls.current];
    const rows = [...rowEls.current];
    timelines.forEach((el) => el.setAttribute("data-scroll-progress", "on"));

    let ticking = false;
    const update = () => {
      ticking = false;
      const triggerY = window.innerHeight * 0.4;

      for (const el of timelines) {
        const rect = el.getBoundingClientRect();
        const progress = rect.height
          ? (triggerY - rect.top) / rect.height
          : 0;
        el.style.setProperty(
          "--exp-fill",
          String(Math.min(1, Math.max(0, progress)))
        );
      }

      for (const el of rows) {
        const rect = el.getBoundingClientRect();
        const passed = rect.bottom <= triggerY;
        const active = !passed && rect.top <= triggerY;
        el.classList.toggle("is-passed", passed);
        el.classList.toggle("is-active", active);

        // Continuous fill (not just an on/off class) so the connecting
        // segment visibly draws itself in as you scroll, instead of
        // popping to solid once the row crosses the trigger line.
        const rowProgress = rect.height
          ? (triggerY - rect.top) / rect.height
          : passed
            ? 1
            : 0;
        el.style.setProperty(
          "--row-fill",
          String(Math.min(1, Math.max(0, rowProgress)))
        );
      }
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      {groups.map(([category, items]) => (
        <div className="timeline-group" key={category || "default"}>
          {category && <div className="timeline-group-head">{category}</div>}
          <div
            className="exp-timeline"
            ref={(el) => {
              if (el) timelineEls.current.add(el);
            }}
          >
            {items.map((e, i) => (
              <div
                className="exp-row"
                key={i}
                ref={(el) => {
                  if (el) rowEls.current.add(el);
                }}
              >
                <div className="exp-node-col">
                  <span className={`exp-dot ${e.color ?? "blue"}`} />
                </div>
                <div className={`tl-card ${e.color ?? "blue"}`}>
                  <div className="tl-period">{e.period}</div>
                  <div className="tl-title">{e.title}</div>
                  {e.org && <div className="tl-org">{e.org}</div>}
                  {e.desc && <div className="tl-desc">{e.desc}</div>}
                  {(e.longDesc || e.href || (e.images && e.images.length > 0)) && (
                    <button
                      type="button"
                      className="btn-ghost exp-detail-btn"
                      onClick={() => setActiveItem(e)}
                    >
                      詳細資訊 <span className="btn-arrow inset">→</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {activeItem && (
        <ProjectModalShell
          kicker={activeItem.category ?? "比賽"}
          kickerColor={activeItem.color ?? "blue"}
          title={activeItem.title}
          desc={activeItem.org ?? activeItem.period}
          onClose={() => setActiveItem(null)}
        >
          <ExperienceDetailBody item={activeItem} />
        </ProjectModalShell>
      )}
    </>
  );
}
