import React from 'react';
import StarRating from '../StarRating/StarRating';

function ReviewList({ reviews = [] }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="fake-box">
        <p className="detail-copy">No hay opiniones disponibles para este producto aún.</p>
      </div>
    );
  }

  return (
    <div className="reviews-grid">
      {reviews.map((rev, index) => (
        <div key={rev.id || index} className="fake-box">
          <StarRating rating={rev.rating || 5} />
          {rev.title && <strong>{rev.title}</strong>}
          <p className="detail-copy">{rev.comment || rev.text || rev.content}</p>
          <p className="review-author">{rev.author || rev.userName || 'Cliente verificado'}</p>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
