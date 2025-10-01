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
  }, [ratings, searchTerm, ratingFilter]);

  const renderStars = (rating) => {
    const stars = [];
    const numRating = parseInt(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`star ${i <= numRating ? 'filled' : 'empty'}`}>
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
                      <div className="custom-star-rating custom-bottom-line-stars" role="img" title={`${stats.averageRating} out of 5 stars`}>
                        {renderStars(stats.averageRating)}
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
                  aria-expanded="false"
                  onClick={() => {
                    const dropdown = document.querySelector('.custom-dropdown-content-wrapper');
                    if (dropdown) {
                      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                    }
                  }}
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
                <div className="custom-dropdown-content-wrapper" style={{display: 'none'}}>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === 'all' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('all')}
                  >
                    <div className="custom-dropdown-option-label">
                      <span className="formated-value">All ratings</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === '5' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('5')}
                  >
                    <div className="custom-dropdown-option-label">
                      <div className="custom-star-rating-filter custom-score">
                        {renderStars(5)}
                      </div>
                      <span className="formated-value">5 stars</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === '4' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('4')}
                  >
                    <div className="custom-dropdown-option-label">
                      <div className="custom-star-rating-filter custom-score">
                        {renderStars(4)}
                      </div>
                      <span className="formated-value">4 stars</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === '3' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('3')}
                  >
                    <div className="custom-dropdown-option-label">
                      <div className="custom-star-rating-filter custom-score">
                        {renderStars(3)}
                      </div>
                      <span className="formated-value">3 stars</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === '2' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('2')}
                  >
                    <div className="custom-dropdown-option-label">
                      <div className="custom-star-rating-filter custom-score">
                        {renderStars(2)}
                      </div>
                      <span className="formated-value">2 stars</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div 
                    className={`custom-dropdown-option ${ratingFilter === '1' ? 'custom-dropdown-option--focus' : ''}`}
                    onClick={() => setRatingFilter('1')}
                  >
                    <div className="custom-dropdown-option-label">
                      <div className="custom-star-rating-filter custom-score">
                        {renderStars(1)}
                      </div>
                      <span className="formated-value">1 star</span>
                    </div>
                    <svg className="custom-selected-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="custom-review-border-smooth"></div>
        
        <div className="results-info" style={{ margin: '20px 0', color: '#666', fontSize: '0.9rem' }}>
          Showing {filteredRatings.length} of {ratings.length} reviews
        </div>
        
        <div className="custom-reviews-container">
          <div className="custom-reviews-list">
            {filteredRatings.map((rating, index) => (
              <div key={rating.ID || index} className="custom-review">
                <div className="custom-review-left-panel">
                  <div className="custom-reviewer">
                    <div className="custom-reviewer-details">
                      <span className="custom-reviewer-name unselectable" title={rating['Public Name'] || 'Anonymous'}>
                        {rating['Public Name'] || 'Anonymous'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="custom-review-center-panel">
                  <div className="custom-review-rating-title">
                    <div className="custom-star-rating custom-review-star-rating" role="img" title={`${rating.Rating} out of 5 stars`}>
                      {renderStars(rating.Rating)}
                    </div>
                    <div className="custom-review-title" role="heading" aria-level="3">
                      {rating['Review Title'] || 'No Title'}
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