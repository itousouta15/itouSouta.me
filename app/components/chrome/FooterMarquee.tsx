"use client";

import { Fragment, useEffect, useState } from "react";
import { MARQUEE } from "../../data/site";
import { SEASON_NAMES, seasonFor } from "../../lib/season";

export default function FooterMarquee() {
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const season = seasonFor(new Date());
    setGreeting(season ? `${SEASON_NAMES[season]}快樂` : "");
  }, []);

  return (
    <div className="marquee">
      {[0, 1].map((g) => (
        <div
          className="marquee-group"
          key={g}
          aria-hidden={g === 1 ? true : undefined}
        >
          {MARQUEE.map((m, i) => (
            <Fragment key={i}>
              <span>{greeting || m}</span>
              <span className="star">★</span>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
