/**
 * Convert numeric rating (0-5) to star representation
 * @param rating - Number from 0 to 5
 * @returns Object with full stars, half star, and empty stars
 */
export function getRatingStars(rating: number) {
  if (rating < 0 || rating > 5) {
    throw new Error("Rating must be between 0 and 5");
  }

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return { fullStars, hasHalfStar, emptyStars };
}

/**
 * Generate star HTML string
 * @param rating - Number from 0 to 5
 * @returns JSX element with stars
 */
export function StarRating({ rating }: { rating: number }) {
  const { fullStars, hasHalfStar, emptyStars } = getRatingStars(rating);

  return (
    <span className="star-rating">
      {"★".repeat(fullStars)}
      {hasHalfStar && <span className="star-half">⯨</span>}
      {"☆".repeat(emptyStars)}
      <span className="star-score">{rating.toFixed(1)}</span>
    </span>
  );
}
