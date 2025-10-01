import React, { useState, useCallback } from 'react';

const SearchFilter = React.memo(({ onSearchChange, onRatingChange, ratingFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (term) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          onSearchChange(term);
        }, 300);
      };
    })(),
    [onSearchChange]
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const handleRatingSelect = (rating) => {
    onRatingChange(rating);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="custom-search-filter">
      <div className="custom-search-bar">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="custom-search-input"
        />
      </div>
      
      <div className="custom-dropdown-wrapper">
        <button
          type="button"
          className="custom-dropdown-closable"
          onClick={toggleDropdown}
        >
          <div className="custom-dropdown-base">
            <input
              type="text"
              placeholder="Rating"
              readOnly
              className="custom-dropdown-input"
            />
            <div className="custom-dropdown-arrow">▼</div>
          </div>
        </button>
        
        {dropdownOpen && (
          <div className="custom-dropdown-content">
            <div
              className="custom-dropdown-option"
              onClick={() => handleRatingSelect('all')}
            >
              <span className="custom-dropdown-text">All Ratings</span>
              {ratingFilter === 'all' && <span className="custom-dropdown-check">✓</span>}
            </div>
            {[5, 4, 3, 2, 1].map(rating => (
              <div
                key={rating}
                className="custom-dropdown-option"
                onClick={() => handleRatingSelect(rating.toString())}
              >
                <span className="custom-dropdown-text">{rating} Star{rating !== 1 ? 's' : ''}</span>
                {ratingFilter === rating.toString() && <span className="custom-dropdown-check">✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

SearchFilter.displayName = 'SearchFilter';

export default SearchFilter;
