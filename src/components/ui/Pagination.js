import React from 'react';
import './Pagination.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevPage, 
  onNextPage,
  hasPrevPage,
  hasNextPage 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-controls" style={{ 
      textAlign: 'center', 
      margin: '30px 0',
      padding: '20px 0'
    }}>
      <div className="pagination-nav">
        {/* Previous button */}
        {currentPage > 1 && (
          <button 
            onClick={onPrevPage}
            className="pagination-btn pagination-prev"
            aria-label="Previous page"
          >
            ← Previous
          </button>
        )}
        
        {/* Page numbers */}
        <div className="pagination-numbers">
          {getPageNumbers().map((pageNum, index) => {
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
                onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                className={`pagination-btn pagination-number ${
                  currentPage === pageNum ? 'pagination-active' : ''
                } ${pageNum === '...' ? 'ellipsis' : ''}`}
                aria-label={`Go to page ${pageNum}`}
                aria-current={currentPage === pageNum ? 'page' : undefined}
                disabled={pageNum === '...'}
              >
                {pageNum}
              </button>
            );
          })}
        </div>
        
        {/* Next button */}
        {currentPage < totalPages && (
          <button 
            onClick={onNextPage}
            className="pagination-btn pagination-next"
            aria-label="Next page"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
