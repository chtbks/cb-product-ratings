import React from 'react';

const StarRating = ({ rating, size = 'default' }) => {
  const renderStars = () => {
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
          className={`star ${starClass} ${size}`}
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

  return (
    <div className="custom-star-rating">
      {renderStars()}
    </div>
  );
};

export default StarRating;
