import { Like } from "../data";
import { likeThumb, likeCircleThumb } from "../lib/imageThumb";

export default function LikeCard({
  l,
  carousel,
  layout,
}: {
  l: Like;
  carousel?: boolean;
  layout?: "circle";
}) {
  const className = [
    "like-card",
    carousel && "like-card--carousel",
    layout === "circle" && "like-card--circle",
  ]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <div className="like-thumb">
        {l.cover ? (
          <img
            className="like-thumb-img"
            src={layout === "circle" ? likeCircleThumb(l.cover) : likeThumb(l.cover)}
            alt={l.title}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span>IMAGE</span>
        )}
        {l.status && <span className="like-status">{l.status}</span>}
      </div>
      <div className="like-body">
        <div className="like-title-row">
          <div className="like-title">{l.title}</div>
          {l.rating != null && <span className="like-rating">★ {l.rating.toFixed(1)}</span>}
        </div>
        {layout !== "circle" && <div className="like-sub">{l.sub || " "}</div>}
      </div>
    </>
  );

  return l.href ? (
    <a className={className} href={l.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
