import React from 'react';

function StarRating({ rating = 0, maxStars = 5 }) {
  const stars = Array.from({ length: maxStars }, (_, index) => index < rating);

  return (
    <div className="review-stars" aria-label={`${rating} de ${maxStars} estrellas`}>
      {stars.map((isFilled, index) => (
        <span key={index} className={isFilled ? 'star-filled' : 'star-empty'}>
          ★
        </span>
      ))}
    </div>
  );
}

export default StarRating;
