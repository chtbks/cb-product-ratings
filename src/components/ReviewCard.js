import React from 'react';
import StarRating from './StarRating';

const ReviewCard = React.memo(({ review }) => {
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const parseOrderId = (urlParams) => {
    try {
      if (!urlParams) return null;
      const params = JSON.parse(urlParams);
      return params.order_id || null;
    } catch {
      return null;
    }
  };

  const hasOrderId = parseOrderId(review['URL Params']);

  return (
    <div className="custom-review-card">
      <div className="custom-review-header">
        <div className="custom-review-rating">
          <StarRating rating={review.Rating} />
        </div>
        <div className="custom-review-title">
          {review['Review Title']}
        </div>
      </div>
      
      <div className="custom-review-content">
        <div className="custom-reviewer-info">
          <span className="custom-reviewer-name">{review['Public Name']}</span>
          {hasOrderId && (
            <span className="custom-verified-purchase">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" fill="#52DBC1"/>
                <path d="M4 6L5.5 7.5L8 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ color: '#52DBC1' }}>Verified Purchase</span>
            </span>
          )}
        </div>
        <div className="custom-review-text">
          {review['Review Text']}
        </div>
        <div className="custom-review-date">
          {formatDate(review['Review Date'])}
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
