import React from 'react';
import StarRating from '../../ui/StarRating';
import './AnalyticsSection.css';

const AnalyticsSection = ({ 
  stats, 
  showDistributionTooltip, 
  onMouseEnter, 
  onMouseLeave 
}) => {
  // Handle the new analytics service structure
  const analytics = stats || {};
  const basic = analytics.basic || {};
  const distribution = analytics.distribution || {};
  const recommendFriend = analytics.recommendFriend || {};
  const purchaseAgain = analytics.purchaseAgain || {};

  return (
    <div className="custom-widget-container">
      <div className="custom-main-layout">
        <div className="custom-header-container">
          <div className="custom-bottom-line" average-score={basic.averageRating}>
            <div className="custom-summary-section">
              <div className="custom-bottom-line-summary">
                <div className="custom-bottom-line-left-panel custom-bottom-line-score">
                  {basic.averageRating}
                </div>
                <div className="custom-bottom-line-right-panel">
                  <div 
                    className="custom-star-rating custom-bottom-line-stars custom-stars-hoverable" 
                    role="img" 
                    title={`${basic.averageRating} out of 5 stars`}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  >
                    <StarRating rating={basic.averageRating} />
                    {showDistributionTooltip && (
                      <div className="custom-distribution-tooltip">
                        <div className="custom-tooltip-header">
                          <div className="custom-tooltip-rating">{basic.averageRating} out of 5</div>
                          <div className="custom-tooltip-stars">
                            <StarRating rating={basic.averageRating} />
                          </div>
                          <div className="custom-tooltip-total">{basic.totalReviews} global ratings</div>
                        </div>
                        <div className="custom-tooltip-distribution">
                          {[5, 4, 3, 2, 1].map(star => {
                            const count = distribution.counts[star] || 0;
                            const percentage = basic.totalReviews > 0 ? Math.round((count / basic.totalReviews) * 100) : 0;
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
                    <div className="custom-bottom-line-basic-text">{basic.totalReviews} Reviews</div>
                  </div>
                </div>
              </div>
              
              {/* Analytics - Same Line */}
              <div className="custom-analytics-section-container">
                <div className="custom-analytics-inline-container">
                   {/* Recommend Friend Analytics */}
                   {recommendFriend.totalResponses > 0 && (
                     <div className="custom-recommend-analytics-inline">
                       <div className="custom-recommend-percentage-text">
                         <span className="custom-recommend-percentage-inline">{Math.round(recommendFriend.recommendRate)}%</span>
                       </div>
                       <div className="custom-recommend-text">
                         <div className="custom-recommend-label-inline">would recommend</div>
                         <div className="custom-recommend-count-inline">
                           {recommendFriend.recommendCount || Math.round((recommendFriend.recommendRate / 100) * recommendFriend.totalResponses)} of {recommendFriend.totalResponses}
                         </div>
                       </div>
                     </div>
                   )}
                   
                   {/* Purchase Again Analytics */}
                   {purchaseAgain.totalResponses > 0 && (
                     <div className="custom-purchase-again-analytics-inline">
                       <div className="custom-purchase-again-percentage-text">
                         <span className="custom-purchase-again-percentage-inline">{Math.round(purchaseAgain.purchaseAgainRate)}%</span>
                       </div>
                       <div className="custom-purchase-again-text">
                         <div className="custom-purchase-again-label-inline">would purchase again</div>
                         <div className="custom-purchase-again-count-inline">
                           {purchaseAgain.purchaseAgainCount || Math.round((purchaseAgain.purchaseAgainRate / 100) * purchaseAgain.totalResponses)} of {purchaseAgain.totalResponses}
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
