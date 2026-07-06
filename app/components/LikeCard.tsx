import { Like } from "../data";
import { likeThumb, likeCircleThumb } from "../lib/imageThumb";
import { StarRating } from "../lib/ratingStars";

export default function LikeCard({
  l,
  carousel,
  layout,
  onClick,
}: {
  l: Like;
  carousel?: boolean;
  layout?: "circle" | "square";
  onClick?: () => void;
}) {
  const className = [
    "like-card",
    carousel && "like-card--carousel",
    layout === "circle" && "like-card--circle",
    layout === "square" && "like-card--square",
    onClick && "like-card--clickable",
  ]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <div className="like-thumb">
        {l.cover ? (
          <img
            className="like-thumb-img"
            src={layout ? likeCircleThumb(l.cover) : likeThumb(l.cover)}
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
          {l.rating != null && <span className="like-rating"><StarRating rating={l.rating} /></span>}
        </div>
        {layout !== "circle" && <div className="like-sub">{l.sub || " "}</div>}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {body}
      </button>
    );
  }

  return l.href ? (
    <a className={className} href={l.href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
