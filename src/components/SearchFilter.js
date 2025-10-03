import React from 'react';
import StarRating from './StarRating';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  ratingFilter, 
  onRatingChange, 
  dropdownOpen, 
  onToggleDropdown 
}) => {
  return (
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
              onChange={(e) => onSearchChange(e.target.value)}
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
              onClick={onToggleDropdown}
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
                    onClick={() => onRatingChange(option.value)}
                  >
                    <div className="custom-dropdown-option-label">
                      {option.stars && (
                        <div className="custom-star-rating-filter custom-score">
                          <StarRating rating={option.stars} />
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
  );
};

export default SearchFilter;
