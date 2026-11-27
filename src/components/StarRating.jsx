// StarRating.jsx — Interactive and read-only star rating component
import React, { useState } from 'react';

/**
 * Interactive star rating component:
 * - Renders clickable star icons (★ filled, ☆ empty)
 * - Hover effect shows preview
 * - onClick sets value
 * - Display only mode if onChange is not provided
 */
export function StarRating({ value = 0, onChange, max = 5 }) {
  const [hoverRating, setHoverRating] = useState(0);
  const isInteractive = typeof onChange === 'function';

  const stars = Array.from({ length: max }, (_, index) => index + 1);
  const currentRating = hoverRating > 0 ? hoverRating : Number(value) || 0;

  return (
    <div
      className={`star-rating ${isInteractive ? '' : 'readonly'}`.trim()}
      onMouseLeave={() => isInteractive && setHoverRating(0)}
      role={isInteractive ? 'radiogroup' : 'img'}
      aria-label={`Rating: ${value} out of ${max} stars`}
    >
      {stars.map((star) => {
        const isFilled = star <= currentRating;
        const isHovered = isInteractive && hoverRating > 0 && star <= hoverRating;

        return (
          <button
            key={star}
            type="button"
            className={`star ${isFilled ? 'filled' : ''} ${isHovered ? 'hovered' : ''}`.trim()}
            disabled={!isInteractive}
            onClick={() => isInteractive && onChange(star)}
            onMouseEnter={() => isInteractive && setHoverRating(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            tabIndex={isInteractive ? 0 : -1}
          >
            {isFilled ? '★' : '☆'}
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
