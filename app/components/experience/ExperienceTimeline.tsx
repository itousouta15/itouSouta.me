"use client";

import { useState } from "react";
import type { ExperienceItem } from "../../data";
import { experienceImageThumb } from "../../lib/imageThumb";
import ProjectModalShell from "../projects/ProjectModalShell";
import ExperienceDetailBody from "./ExperienceDetailBody";

interface Props {
  groups: [string, ExperienceItem[]][];
}

export default function ExperienceTimeline({ groups }: Props) {
  const [activeItem, setActiveItem] = useState<ExperienceItem | null>(null);

  return (
    <>
      {groups.map(([category, items], groupIndex) => (
        <section
          className="timeline-group"
          key={category || "default"}
          aria-labelledby={`experience-group-${groupIndex}`}
        >
          <div className="timeline-group-head">
            <span className="timeline-group-number" aria-hidden="true">
              {String(groupIndex + 1).padStart(2, "0")}
            </span>
            <h2 id={`experience-group-${groupIndex}`}>{category || "經歷"}</h2>
            <span className="timeline-group-count">{items.length} 項</span>
          </div>
          <ol className="exp-timeline">
            {items.map((item, index) => {
              const preview = item.image ?? item.images?.[0];
              return (
                <li
                  className={`exp-entry${preview ? " exp-entry--with-image" : ""}`}
                  key={`${item.title}-${index}`}
                >
                  <div className="exp-period">{item.period}</div>
                  <div className="exp-entry-content">
                    <h3 className="exp-entry-title">{item.title}</h3>
                    {item.org && <p className="exp-entry-org">{item.org}</p>}
                    {item.desc && <p className="exp-entry-desc">{item.desc}</p>}
                    {(item.longDesc ||
                      item.href ||
                      (item.images && item.images.length > 0)) && (
                      <button
                        type="button"
                        className="exp-detail-btn"
                        onClick={() => setActiveItem(item)}
                      >
                        詳細資訊 <span aria-hidden="true">↗</span>
                      </button>
                    )}
                  </div>
                  {preview && (
                    <div className="exp-entry-media" aria-hidden="true">
                      <img
                        src={experienceImageThumb(preview)}
                        alt=""
                        width={400}
                        height={240}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </section>
      ))}

      {activeItem && (
        <ProjectModalShell
          kicker={activeItem.category ?? "經歷"}
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
