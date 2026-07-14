import { Like } from "../data";
import { likeThumb, likeCircleThumb } from "../lib/imageThumb";
import { StarRating } from "../lib/ratingStars";
import type { LiveInfo } from "../hooks/useVtuberLiveStatus";

export default function LikeCard({
  l,
  carousel,
  layout,
  onClick,
  live,
}: {
  l: Like;
  carousel?: boolean;
  layout?: "circle" | "square";
  onClick?: () => void;
  live?: LiveInfo;
}) {
  const className = [
    "like-card",
    carousel && "like-card--carousel",
    layout === "circle" && "like-card--circle",
    layout === "square" && "like-card--square",
    onClick && "like-card--clickable",
    live?.live && "like-card--live",
  ]
    .filter(Boolean)
    .join(" ");
  const body = (
    <>
      <div className="like-thumb">
        <div className="like-thumb-clip">
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
        </div>
        {l.status && <span className="like-status">{l.status}</span>}
        {live?.live && <span className="like-live-badge">LIVE</span>}
      </div>
      <div className="like-body">
        <div className="like-title-row">
          <div className="like-title">{l.title}</div>
          {l.rating != null && <span className="like-rating"><StarRating rating={l.rating} /></span>}
        </div>
        {layout !== "circle" && <div className="like-sub">{l.sub || " "}</div>}
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

  // 開台時點下去直接跳直播間，沒開台就照舊連去頻道頁
  const href = (live?.live && live.url) || l.href;

  return href ? (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {body}
    </a>
  ) : (
    <div className={className}>{body}</div>
  );
}
