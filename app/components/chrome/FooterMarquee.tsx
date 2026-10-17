import { Fragment } from "react";
import { MARQUEE } from "../../data/site";

export default function FooterMarquee() {
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
              <span>{m}</span>
              <span className="star">★</span>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}
