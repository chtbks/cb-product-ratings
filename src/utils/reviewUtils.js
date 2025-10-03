/**
 * Utility functions specific to review data
 */

/**
 * Parses URL parameters from a review to check for order ID
 * @param {string} urlParams - The URL parameters string
 * @returns {object|null} - Parsed parameters or null if invalid
 */
export const parseOrderId = (urlParams) => {
  try {
    if (!urlParams) return null;
    const params = JSON.parse(urlParams);
    return params.order_id ? params : null;
  } catch {
    return null;
  }
};

/**
 * Checks if a review has a verified purchase
 * @param {object} review - The review object
 * @returns {boolean} - True if verified purchase
 */
export const hasVerifiedPurchase = (review) => {
  const parsedParams = parseOrderId(review['URL Params']);
  return parsedParams && parsedParams.order_id;
};

/**
 * Filters reviews based on search term
 * @param {array} reviews - Array of reviews
 * @param {string} searchTerm - Search term
 * @returns {array} - Filtered reviews
 */
export const filterReviewsBySearch = (reviews, searchTerm) => {
  if (!searchTerm) return reviews;
  
  const term = searchTerm.toLowerCase();
  return reviews.filter(review => 
    review['Review Title']?.toLowerCase().includes(term) ||
    review['Review Text']?.toLowerCase().includes(term) ||
    review['Public Name']?.toLowerCase().includes(term)
  );
};

/**
 * Filters reviews by rating
 * @param {array} reviews - Array of reviews
 * @param {string|number} ratingFilter - Rating filter ('all' or specific rating)
 * @returns {array} - Filtered reviews
 */
export const filterReviewsByRating = (reviews, ratingFilter) => {
  if (ratingFilter === 'all') return reviews;
  return reviews.filter(review => review.Rating === parseInt(ratingFilter, 10));
};

/**
 * Gets the average rating from an array of reviews
 * @param {array} reviews - Array of reviews
 * @returns {number} - Average rating
 */
export const getAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  
  const validRatings = reviews
    .map(review => parseFloat(review.Rating))
    .filter(rating => !isNaN(rating));
  
  if (validRatings.length === 0) return 0;
  
  const sum = validRatings.reduce((acc, rating) => acc + rating, 0);
  return Math.round((sum / validRatings.length) * 10) / 10;
};

/**
 * Gets rating distribution from reviews
 * @param {array} reviews - Array of reviews
 * @returns {object} - Rating distribution object
 */
export const getRatingDistribution = (reviews) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  
  reviews.forEach(review => {
    const rating = parseInt(review.Rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });
  
  return distribution;
};
