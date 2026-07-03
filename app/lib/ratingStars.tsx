/**
 * Render a 5-star rating as an overlay of a dim "track" row of stars and a
 * clipped "fill" row on top, sized to the rating percentage. This avoids
 * relying on half-star Unicode glyphs (e.g. U+2BE8), which many fonts
 * (especially on mobile) don't render correctly.
 */
export function StarRating({ rating }: { rating: number }) {
  const clamped = Math.max(0, Math.min(5, rating));
  const percent = (clamped / 5) * 100;
  const stars = "★★★★★";

  return (
    <span className="star-rating">
      <span className="star-rating-glyphs" aria-hidden="true">
        <span className="star-rating-track">{stars}</span>
        <span className="star-rating-fill" style={{ width: `${percent}%` }}>
          {stars}
        </span>
      </span>
      <span className="star-score">{clamped.toFixed(1)}</span>
    </span>
  );
}
