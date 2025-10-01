import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';

function App() {
  const [ratings, setRatings] = useState([]);
  const [filteredRatings, setFilteredRatings] = useState([]);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [reviewsPerPage] = useState(10);

  // Global dropdown handler
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const selectRating = (rating) => {
    setRatingFilter(rating);
    setDropdownOpen(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  // Pagination logic
  const getCurrentPageReviews = () => {
    const startIndex = (currentPage - 1) * reviewsPerPage;
    const endIndex = startIndex + reviewsPerPage;
    return filteredRatings.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredRatings.length / reviewsPerPage);
  const hasMorePages = currentPage < totalPages;
  const currentReviews = getCurrentPageReviews();

  const loadMoreReviews = () => {
    setCurrentPage(prev => prev + 1);
  };

  const resetPagination = () => {
    setCurrentPage(1);
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
        setRatings(data);
        setFilteredRatings(data);
        calculateStats(data);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        // Fallback to sample data if CSV fails to load
        const sampleData = [
          {
            ID: '1',
            'Review Title': 'Great product!',
            Rating: '5',
            'Review Text': 'I love this product, it works perfectly.',
            'Public Name': 'John D.',
            'Review Date': '2024-01-15'
          },
          {
            ID: '2', 
            'Review Title': 'Amazing quality',
            Rating: '4',
            'Review Text': 'Very good quality, would recommend.',
            'Public Name': 'Sarah M.',
            'Review Date': '2024-01-14'
          }
        ];
        setRatings(sampleData);
        setFilteredRatings(sampleData);
        calculateStats(sampleData);
        setLoading(false);
      }
    });
  }, []);

  const calculateStats = (data) => {
    const totalReviews = data.length;
    const ratingsArray = data.map(row => parseInt(row.Rating)).filter(rating => !isNaN(rating));
    const averageRating = ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length;
    
    const ratingDistribution = {};
    ratingsArray.forEach(rating => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    setStats({
      totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution
    });
  };

  useEffect(() => {
    let filtered = ratings;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(rating => 
        rating['Review Title']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating['Review Text']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rating['Public Name']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by rating
    if (ratingFilter !== 'all') {
      filtered = filtered.filter(rating => rating.Rating === ratingFilter);
    }

    setFilteredRatings(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [ratings, searchTerm, ratingFilter]);

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

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product ratings...</p>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="reviews-section-wrapper">
        <div className="reviews-title">Take it from our community...</div>
        
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
                        onMouseEnter={() => setShowDistributionTooltip(true)}
                        onMouseLeave={() => setShowDistributionTooltip(false)}
                      >
                        {renderStars(stats.averageRating)}
                        {showDistributionTooltip && (
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
                      <div className="custom-bottom-line-text">
                        <div className="custom-bottom-line-basic-text">{stats.totalReviews} Reviews</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="custom-filters-container">
          <div className="custom-filters-container-inner">
            <div className="custom-filters-top-panel">
              <div className="custom-search-filter custom-free-search-filter-container">
                <label htmlFor="searchInput" className="sr-only">Search reviews</label>
                <input 
                  id="searchInput" 
                  type="text" 
                  className="custom-search-input" 
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="custom-icon-button__container">
                  <button className="custom-icon-button" aria-label="Search reviews">
                    <span className="custom-icon-button__icon">
                      <svg width="15" height="15" viewBox="0 0 13 13" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10.2694 9.38563L12.9462 12.0619L12.0619 12.9462L9.38563 10.2694C8.38984 11.0676 7.15125 11.5018 5.875 11.5C2.77 11.5 0.25 8.98 0.25 5.875C0.25 2.77 2.77 0.25 5.875 0.25C8.98 0.25 11.5 2.77 11.5 5.875C11.5018 7.15125 11.0676 8.38984 10.2694 9.38563ZM9.01562 8.92188C9.80882 8.10618 10.2518 7.01277 10.25 5.875C10.25 3.4575 8.29187 1.5 5.875 1.5C3.4575 1.5 1.5 3.4575 1.5 5.875C1.5 8.29187 3.4575 10.25 5.875 10.25C7.01277 10.2518 8.10618 9.80882 8.92188 9.01562L9.01562 8.92188Z"></path>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              
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
            </div>
          </div>
        </div>

        <div className="custom-review-border-smooth"></div>
        
        <div className="results-info" style={{ margin: '20px 0', color: '#666', fontSize: '0.9rem' }}>
          Showing {currentReviews.length} of {filteredRatings.length} reviews
          {filteredRatings.length > reviewsPerPage && (
            <span> (Page {currentPage} of {totalPages})</span>
          )}
        </div>
        
        <div className="custom-reviews-container">
          <div className="custom-reviews-list">
            {currentReviews.map((rating, index) => (
              <div key={rating.ID || index} className="custom-review">
                <div className="custom-review-center-panel">
                  <div className="custom-review-rating-title">
                    <div className="custom-star-rating custom-review-star-rating" role="img" title={`${rating.Rating} out of 5 stars`}>
                      {renderStars(rating.Rating)}
                    </div>
                    <div className="custom-review-title" role="heading" aria-level="3">
                      {rating['Review Title'] || 'No Title'}
                    </div>
                  </div>
                  
                  <div className="custom-reviewer">
                    <div className="custom-reviewer-details">
                      <div className="custom-reviewer-name-container">
                        <span className="custom-reviewer-name unselectable" title={rating['Public Name'] || 'Anonymous'}>
                          {rating['Public Name'] || 'Anonymous'}
                        </span>
                        {(() => {
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
                  </div>
                  
                  <div className="custom-review-content">
                    <div className="custom-text-container">
                      <p className="custom-read-more-text">
                        {rating['Review Text'] || 'No review text available'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="custom-review-right-panel">
                  <div className="custom-review-details">
                    <div className="custom-review-date">
                      <span className="custom-date-label">Published date</span>
                      <div className="custom-date-format">{formatDate(rating['Review Date'])}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="pagination-controls" style={{ 
            textAlign: 'center', 
            margin: '30px 0',
            padding: '20px 0'
          }}>
            <div className="pagination-nav">
              {/* Previous button */}
              {currentPage > 1 && (
                <button 
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="pagination-btn pagination-prev"
                  aria-label="Previous page"
                >
                  ← Previous
                </button>
              )}
              
              {/* Page numbers */}
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Show first page, last page, current page, and pages around current
                  const showPage = 
                    pageNum === 1 || 
                    pageNum === totalPages || 
                    (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  
                  if (!showPage) {
                    // Show ellipsis for gaps
                    if (pageNum === 2 && currentPage > 3) {
                      return <span key={`ellipsis-${pageNum}`} className="pagination-ellipsis">...</span>;
                    }
                    if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
                      return <span key={`ellipsis-${pageNum}`} className="pagination-ellipsis">...</span>;
                    }
                    return null;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`pagination-btn pagination-number ${
                        currentPage === pageNum ? 'pagination-active' : ''
                      }`}
                      aria-label={`Go to page ${pageNum}`}
                      aria-current={currentPage === pageNum ? 'page' : undefined}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              {/* Next button */}
              {currentPage < totalPages && (
                <button 
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="pagination-btn pagination-next"
                  aria-label="Next page"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination Info */}
        {filteredRatings.length > reviewsPerPage && (
          <div className="pagination-info" style={{ 
            textAlign: 'center', 
            margin: '20px 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <span>
              Showing {Math.min(currentPage * reviewsPerPage, filteredRatings.length)} of {filteredRatings.length} reviews
            </span>
          </div>
        )}

        {filteredRatings.length === 0 && (
          <div className="no-results">
            <p>No reviews found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;