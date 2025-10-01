import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './Widget.css';

const ChatbooksRatingsWidget = ({ 
  config = {},
  containerId = 'chatbooks-ratings-widget'
}) => {
  // Default configuration
  const defaultConfig = {
    productId: 'default',
    theme: 'light',
    showSearch: true,
    showFilters: true,
    maxReviews: 10,
    showVerifiedPurchase: true,
    showDistributionTooltip: true,
    customStyles: {}
  };

  const finalConfig = { ...defaultConfig, ...config };

  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {}
  });
  const [showDistributionTooltip, setShowDistributionTooltip] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Global dropdown handler
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectRating = (rating) => {
    setRatingFilter(rating);
    setDropdownOpen(false);
  };

  useEffect(() => {
    // Load CSV data
    Papa.parse('/product-ratings.csv', {
      download: true,
      header: true,
      complete: (results) => {
        console.log('CSV parsing complete:', results);
        const data = results.data.filter(row => row.ID && row.Rating); // Filter out empty rows
        console.log('Filtered data:', data.length, 'rows');
        setReviews(data);
        setFilteredReviews(data);
        calculateStats(data);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        setLoading(false);
      }
    });
  }, []);

  const calculateStats = (data) => {
    const totalReviews = data.length;
    const sum = data.reduce((acc, review) => acc + parseFloat(review.Rating), 0);
    const averageRating = totalReviews > 0 ? (sum / totalReviews).toFixed(1) : 0;
    
    const distribution = {};
    for (let i = 1; i <= 5; i++) {
      distribution[i] = data.filter(review => parseInt(review.Rating) === i).length;
    }
    
    setStats({
      totalReviews,
      averageRating: parseFloat(averageRating),
      ratingDistribution: distribution
    });
  };

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseFloat(rating);
    const fullStars = Math.floor(numRating);
    const decimalPart = numRating % 1;
    
    for (let i = 1; i <= 5; i++) {
      let starClass = 'empty';
      let fillPercentage = 0;
      
      if (i <= fullStars) {
        starClass = 'filled';
        fillPercentage = 100;
      } else if (i === fullStars + 1 && decimalPart > 0) {
        starClass = 'partial';
        fillPercentage = Math.round(decimalPart * 100);
      }
      
      stars.push(
        <span 
          key={i} 
          className={`star ${starClass}`}
          style={fillPercentage > 0 && fillPercentage < 100 ? 
            { '--fill-percentage': `${fillPercentage}%` } : {}
          }
        >
          ★
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(review => 
        review['Review Title']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review['Review Content']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== 'all') {
      filtered = filtered.filter(review => review.Rating === ratingFilter);
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter]);

  if (loading) {
    return (
      <div className="chatbooks-ratings-widget" style={finalConfig.customStyles}>
        <div className="custom-loading-spinner">
          <div className="spinner"></div>
          <p>Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chatbooks-ratings-widget" style={finalConfig.customStyles}>
      <div className="custom-reviews-section">
        <div className="custom-widget-container">
          <div className="custom-summary-section">
            <div className="custom-summary-content">
              <div className="custom-summary-score">
                <span className="custom-score-number">{stats.averageRating}</span>
                <div 
                  className="custom-star-rating custom-bottom-line-stars custom-stars-hoverable" 
                  role="img" 
                  title={`${stats.averageRating} out of 5 stars`}
                  onMouseEnter={() => setShowDistributionTooltip(true)}
                  onMouseLeave={() => setShowDistributionTooltip(false)}
                >
                  {renderStars(stats.averageRating)}
                  {showDistributionTooltip && finalConfig.showDistributionTooltip && (
                    <div className="custom-distribution-tooltip">
                      <div className="custom-tooltip-header">
                        <div className="custom-tooltip-rating">{stats.averageRating} out of 5</div>
                        <div className="custom-tooltip-stars">
                          {renderStars(stats.averageRating)}
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
              </div>
              <div className="custom-summary-text">
                <div className="custom-summary-title">Take it from our community...</div>
                <div className="custom-summary-subtitle">
                  Based on {stats.totalReviews} reviews
                </div>
              </div>
            </div>
          </div>

          {finalConfig.showSearch || finalConfig.showFilters ? (
            <div className="custom-filters-section">
              <div className="custom-search-filter-container">
                {finalConfig.showSearch && (
                  <div className="custom-search-filter">
                    <input
                      type="text"
                      className="custom-search-input"
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button className="custom-search-button">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                )}
                
                {finalConfig.showFilters && (
                  <div className="custom-dropdown-wrapper custom-score-filter-container">
                    <button 
                      className="custom-dropdown-closable" 
                      aria-expanded={dropdownOpen}
                      onClick={toggleDropdown}
                    >
                      <div className="custom-dropdown-base">
                        <input 
                          type="text" 
                          className="custom-dropdown-input" 
                          placeholder="Rating"
                          value={ratingFilter === 'all' ? '' : `${ratingFilter} stars`}
                          readOnly
                        />
                        <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg" className="custom-dropdown-arrow-icon">
                          <path d="M1 1L5 5L9 1" stroke="rgba(0,0,0,1)" strokeWidth="1.5"></path>
                        </svg>
                      </div>
                    </button>
                    
                    {dropdownOpen && (
                      <div className="custom-dropdown-content-wrapper">
                        {[
                          { value: 'all', label: 'All ratings', stars: null },
                          { value: '5', label: '5 stars', stars: 5 },
                          { value: '4', label: '4 stars', stars: 4 },
                          { value: '3', label: '3 stars', stars: 3 },
                          { value: '2', label: '2 stars', stars: 2 },
                          { value: '1', label: '1 star', stars: 1 }
                        ].map((option) => (
                          <div 
                            key={option.value}
                            className={`custom-dropdown-option ${ratingFilter === option.value ? 'custom-dropdown-option--focus' : ''}`}
                            onClick={() => selectRating(option.value)}
                          >
                            <div className="custom-dropdown-option-label">
                              {option.stars && (
                                <div className="custom-star-rating-filter custom-score">
                                  {renderStars(option.stars)}
                                </div>
                              )}
                              <span className="formated-value">{option.label}</span>
                            </div>
                            {ratingFilter === option.value && (
                              <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <div className="custom-review-border-smooth"></div>

          <div className="custom-reviews-list">
            {filteredReviews.length === 0 ? (
              <div className="custom-no-results">
                <p>No reviews found matching your criteria.</p>
              </div>
            ) : (
              filteredReviews.slice(0, finalConfig.maxReviews).map((rating, index) => (
                <div key={index} className="custom-review-item">
                  <div className="custom-review-header">
                    <div className="custom-review-rating">
                      <div className="custom-star-rating">
                        {renderStars(rating.Rating)}
                      </div>
                      <div className="custom-review-title">{rating['Review Title']}</div>
                    </div>
                    <div className="custom-reviewer-name-container">
                      <span className="custom-reviewer-name unselectable" title={rating['Public Name'] || 'Anonymous'}>
                        {rating['Public Name'] || 'Anonymous'}
                      </span>
                      {finalConfig.showVerifiedPurchase && (() => {
                        try {
                          const urlParams = rating['URL Params'];
                          if (urlParams) {
                            const parsedParams = JSON.parse(urlParams);
                            return parsedParams.order_id && (
                              <span className="custom-verified-purchase">
                                <span className="custom-verified-text">Verified Purchase</span>
                                <span className="custom-verified-icon">
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </span>
                              </span>
                            );
                          }
                        } catch (e) {
                          // If JSON parsing fails, don't show the tag
                        }
                        return null;
                      })()}
                    </div>
                  </div>
                  <div className="custom-text-container">
                    {rating['Review Content']}
                  </div>
                  <div className="custom-review-date">
                    {new Date(rating['Review Date']).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbooksRatingsWidget;
