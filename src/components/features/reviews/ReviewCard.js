import React from 'react';
import StarRating from '../../ui/StarRating';
import { formatDate, hasVerifiedPurchase } from '../../../utils';
import './ReviewCard.css';

const ReviewCard = ({ review }) => {
  return (
    <div className="custom-review">
      <div className="custom-review-center-panel">
        <div className="custom-review-rating-title">
          <div className="custom-star-rating custom-review-star-rating" role="img" title={`${review.Rating} out of 5 stars`}>
            <StarRating rating={review.Rating} />
          </div>
          <div className="custom-review-title" role="heading" aria-level="3">
            {review['Review Title'] || 'No Title'}
          </div>
        </div>
        
        <div className="custom-reviewer">
          <div className="custom-reviewer-details">
            <div className="custom-reviewer-name-container">
              <span className="custom-reviewer-name unselectable" title={review['Public Name'] || 'Anonymous'}>
                {review['Public Name'] || 'Anonymous'}
              </span>
              {hasVerifiedPurchase(review) && (
                <span className="custom-verified-purchase">
                  <span className="custom-verified-text">Verified Purchase</span>
                  <span className="custom-verified-icon">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="custom-review-content">
          <div className="custom-text-container">
            <p className="custom-read-more-text">
              {review['Review Text'] || 'No review text available'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="custom-review-right-panel">
        <div className="custom-review-details">
          <div className="custom-review-date">
            <span className="custom-date-label">Published date</span>
            <div className="custom-date-format">{formatDate(review['Review Date'])}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
