import type { Like } from "../data";
import { likeThumb, likeCircleThumb } from "../lib/imageThumb";

export default function LikeDetailBody({ item, layout }: { item: Like; layout?: "circle" | "square" }) {
  const hasMeta = item.rating != null || item.status;

  return (
    <>
      {item.cover && (
        <img
          className="proj-detail-cover"
          src={layout ? likeCircleThumb(item.cover) : likeThumb(item.cover)}
          alt={`${item.title} 封面`}
          loading="lazy"
          decoding="async"
        />
      )}

      {hasMeta && (
        <div className="like-detail-meta">
          {item.rating != null && <span className="like-rating">★ {item.rating.toFixed(1)}</span>}
          {item.status && <span className="thought-tag">{item.status}</span>}
        </div>
      )}

      {item.tags && item.tags.length > 0 && (
        <div className="proj-tags" style={{ marginTop: 16 }}>
          {item.tags.map(t => (
            <span className="proj-tag" key={t}>{t}</span>
          ))}
        </div>
      )}

      {item.href && (
        <div className="proj-detail-actions">
          <a className="btn-primary" href={item.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
            前往 <span className="btn-arrow dark">→</span>
          </a>
        </div>
      )}

      {item.note && (
        <div className="proj-detail-section">
          <div className="card-kicker">心得</div>
          <p className="about-p">{item.note}</p>
        </div>
      )}
    </>
  );
}
