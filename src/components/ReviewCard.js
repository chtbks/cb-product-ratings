import React from 'react';
import PropTypes from 'prop-types';
import StarRating from './StarRating';
import { formatDate } from '../utils/dateUtils';
import { sanitizeHtml, extractInitials } from '../utils/stringUtils';

const ReviewCard = React.memo(({ review }) => {

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
        <div 
          className="custom-review-text"
          dangerouslySetInnerHTML={{ 
            __html: sanitizeHtml(review['Review Text']) 
          }}
        />
        <div className="custom-review-date">
          {formatDate(review['Review Date'])}
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

ReviewCard.propTypes = {
  review: PropTypes.shape({
    ID: PropTypes.string.isRequired,
    Rating: PropTypes.string.isRequired,
    'Review Title': PropTypes.string,
    'Review Text': PropTypes.string,
    'Public Name': PropTypes.string,
    'Review Date': PropTypes.string,
    'URL Params': PropTypes.string
  }).isRequired
};

export default ReviewCard;
