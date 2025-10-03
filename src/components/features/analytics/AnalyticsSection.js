import React from 'react';
import StarRating from '../../ui/StarRating';
import './AnalyticsSection.css';

const AnalyticsSection = ({ 
  stats, 
  showDistributionTooltip, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  return (
    <div className="custom-widget-container">
      <div className="custom-main-layout">
        <div className="custom-header-container">
          <div className="custom-bottom-line" average-score={stats.averageRating}>
            <div className="custom-summary-section">
              <div className="custom-bottom-line-summary">
                <div className="custom-bottom-line-left-panel custom-bottom-line-score">
                  {stats.averageRating}
                </div>
                <div className="custom-bottom-line-right-panel">
                  <div 
                    className="custom-star-rating custom-bottom-line-stars custom-stars-hoverable" 
                    role="img" 
                    title={`${stats.averageRating} out of 5 stars`}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  >
                    <StarRating rating={stats.averageRating} />
                    {showDistributionTooltip && (
                      <div className="custom-distribution-tooltip">
                        <div className="custom-tooltip-header">
                          <div className="custom-tooltip-rating">{stats.averageRating} out of 5</div>
                          <div className="custom-tooltip-stars">
                            <StarRating rating={stats.averageRating} />
                          </div>
                          <div className="custom-tooltip-total">{stats.totalReviews} global ratings</div>
                        </div>
                        <div className="custom-tooltip-distribution">
                          {[5, 4, 3, 2, 1].map(star => {
                            const count = stats.ratingDistribution[star] || 0;
                            const percentage = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
                            return (
                              <div key={star} className="custom-distribution-row">
                                <div className="custom-distribution-label">{star} star</div>
                                <div className="custom-distribution-bar">
                                  <div 
                                    className="custom-distribution-fill" 
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                                <div className="custom-distribution-percentage">{percentage}%</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="custom-bottom-line-text">
                    <div className="custom-bottom-line-basic-text">{stats.totalReviews} Reviews</div>
                  </div>
                </div>
              </div>
              
              {/* Analytics - Same Line */}
              <div className="custom-analytics-section-container">
                <div className="custom-analytics-inline-container">
                   {/* Recommend Friend Analytics */}
                   {stats.recommendFriendStats.totalResponses > 0 && (
                     <div className="custom-recommend-analytics-inline">
                       <div className="custom-recommend-percentage-text">
                         <span className="custom-recommend-percentage-inline">{Math.round(stats.recommendFriendStats.recommendRate)}%</span>
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
                         <span className="custom-purchase-again-percentage-inline">{Math.round(stats.purchaseAgainStats.purchaseAgainRate)}%</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsSection;
