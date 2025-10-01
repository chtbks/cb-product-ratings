import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import ReviewCard from './ReviewCard';

// Lazy-loaded review card component
const LazyReviewCard = React.memo(({ review }) => {
  const [ref, isIntersecting, hasIntersected] = useIntersectionObserver();

  return (
    <div ref={ref}>
      {hasIntersected ? (
        <ReviewCard review={review} />
      ) : (
        <div className="custom-review-card-placeholder" style={{ height: '200px' }}>
          <div className="loading-skeleton">
            <div className="skeleton-header"></div>
            <div className="skeleton-content"></div>
            <div className="skeleton-footer"></div>
          </div>
        </div>
      )}
    </div>
  );
});

LazyReviewCard.displayName = 'LazyReviewCard';

export default LazyReviewCard;
