import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Import components
import AnalyticsSection from './components/AnalyticsSection';
import SearchFilter from './components/SearchFilter';
import ReviewCard from './components/ReviewCard';
import Pagination from './components/Pagination';

// Import hooks
import { useReviews } from './hooks/useReviews';
import { useAnalytics } from './hooks/useAnalytics';
import { usePagination } from './hooks/usePagination';

function App() {
  const { ratings, loading, error } = useReviews();
  const analytics = useAnalytics(ratings);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [showDistributionTooltip, setShowDistributionTooltip] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter reviews based on search and rating
  const filteredRatings = useMemo(() => {
    if (!ratings) return [];
    
    return ratings.filter(review => {
      const matchesSearch = !searchTerm || 
        review['Review Title']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review['Review Text']?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review['Public Name']?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || 
        review.Rating === ratingFilter;
      
      return matchesSearch && matchesRating;
    });
  }, [ratings, searchTerm, ratingFilter]);

  // Pagination
  const {
    currentItems: currentReviews,
    totalPages,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    hasNextPage,
    hasPrevPage
  } = usePagination(filteredRatings, 10);

  // Filter handlers
  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleRatingChange = (rating) => {
    setRatingFilter(rating);
    setDropdownOpen(false);
  };

  const handleToggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Analytics mouse handlers
  const handleMouseEnter = () => setShowDistributionTooltip(true);
  const handleMouseLeave = () => setShowDistributionTooltip(false);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product ratings...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading Reviews</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="reviews-section-wrapper">
        <div className="reviews-title">Customer Reviews</div>
        
        {/* Analytics Section */}
        <AnalyticsSection 
          stats={analytics}
          showDistributionTooltip={showDistributionTooltip}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          ratingFilter={ratingFilter}
          onRatingChange={handleRatingChange}
          dropdownOpen={dropdownOpen}
          onToggleDropdown={handleToggleDropdown}
        />

        <div className="custom-review-border-smooth"></div>
        
        {/* Results Info */}
        <div className="results-info" style={{ margin: '20px 0', color: '#666', fontSize: '0.9rem' }}>
          Showing {currentReviews.length} of {filteredRatings.length} reviews
          {filteredRatings.length > 10 && (
            <span> (Page {currentPage} of {totalPages})</span>
          )}
        </div>
        
        {/* Reviews List */}
        <div className="custom-reviews-container">
          <div className="custom-reviews-list">
            {currentReviews.map((review, index) => (
              <ReviewCard key={review.ID || index} review={review} />
            ))}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
          />
        )}

        {/* Pagination Info */}
        {filteredRatings.length > 10 && (
          <div className="pagination-info" style={{ 
            textAlign: 'center', 
            margin: '20px 0',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            <span>
              Showing {Math.min(currentPage * 10, filteredRatings.length)} of {filteredRatings.length} reviews
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