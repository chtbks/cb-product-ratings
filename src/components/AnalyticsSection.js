import React from 'react';
import StarRating from './StarRating';

const AnalyticsSection = React.memo(({ stats, showDistributionTooltip, onMouseEnter, onMouseLeave }) => {
  return (
    <div className="custom-reviews-summary">
      <div className="custom-reviews-summary-header">
        <div className="custom-reviews-summary-left">
          <div className="custom-reviews-summary-score">
            {stats.averageRating}
          </div>
          <div 
            className="custom-reviews-summary-stars"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            <StarRating rating={stats.averageRating} />
          </div>
          <div className="custom-reviews-summary-count">
            Based on {stats.totalReviews} reviews
          </div>
        </div>
      </div>

      {/* Star Distribution Tooltip */}
      {showDistributionTooltip && (
        <div className="custom-distribution-tooltip">
          <div className="custom-tooltip-header">Rating Distribution</div>
          {[5, 4, 3, 2, 1].map(rating => {
            const count = stats.ratingDistribution[rating] || 0;
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            return (
              <div key={rating} className="custom-tooltip-row">
                <span className="custom-tooltip-rating">{rating}★</span>
                <div className="custom-tooltip-bar">
                  <div 
                    className="custom-tooltip-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="custom-tooltip-percentage">{Math.round(percentage)}%</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Analytics Section Container */}
      <div className="custom-analytics-section-container">
        <div className="custom-analytics-inline-container">
          {/* Recommend Friend Analytics */}
          {stats.recommendFriendStats.totalResponses > 0 && (
            <div className="custom-recommend-analytics-inline">
              <div className="custom-recommend-percentage-text">
                <span className="custom-recommend-percentage-inline">
                  {Math.round(stats.recommendFriendStats.recommendRate)}%
                </span>
              </div>
              <div className="custom-recommend-text">
                <div className="custom-recommend-label-inline">would recommend</div>
                <div className="custom-recommend-count-inline">
                  {stats.recommendFriendStats.recommendCount || Math.round((stats.recommendFriendStats.recommendRate / 100) * stats.recommendFriendStats.totalResponses)} of {stats.recommendFriendStats.totalResponses}
                </div>
              </div>
            </div>
          )}
          
          {/* Purchase Again Analytics */}
          {stats.purchaseAgainStats.totalResponses > 0 && (
            <div className="custom-purchase-again-analytics-inline">
              <div className="custom-purchase-again-percentage-text">
                <span className="custom-purchase-again-percentage-inline">
                  {Math.round(stats.purchaseAgainStats.purchaseAgainRate)}%
                </span>
              </div>
              <div className="custom-purchase-again-text">
                <div className="custom-purchase-again-label-inline">would purchase again</div>
                <div className="custom-purchase-again-count-inline">
                  {stats.purchaseAgainStats.purchaseAgainCount || Math.round((stats.purchaseAgainStats.purchaseAgainRate / 100) * stats.purchaseAgainStats.totalResponses)} of {stats.purchaseAgainStats.totalResponses}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

AnalyticsSection.displayName = 'AnalyticsSection';

export default AnalyticsSection;
