import { VALIDATION } from './constants';

// Validate CSV data structure
export const validateCSVData = (data) => {
  if (!Array.isArray(data)) {
    return { isValid: false, error: 'Data is not an array' };
  }

  const requiredFields = ['ID', 'Rating'];
  const errors = [];

  data.forEach((row, index) => {
    // Check required fields
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 1}: Missing required field '${field}'`);
      }
    });

    // Validate rating
    if (row.Rating) {
      const rating = parseInt(row.Rating);
      if (isNaN(rating) || rating < VALIDATION.MIN_RATING || rating > VALIDATION.MAX_RATING) {
        errors.push(`Row ${index + 1}: Invalid rating '${row.Rating}'`);
      }
    }

    // Validate review text length
    if (row['Review Text'] && row['Review Text'].length > VALIDATION.MAX_REVIEW_LENGTH) {
      errors.push(`Row ${index + 1}: Review text too long`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, VALIDATION.MAX_REVIEW_LENGTH);
};

// Validate search term
export const validateSearchTerm = (term) => {
  if (!term || typeof term !== 'string') return false;
  return term.trim().length >= 1;
};

// Validate rating filter
export const validateRatingFilter = (filter) => {
  const validFilters = ['all', '1', '2', '3', '4', '5'];
  return validFilters.includes(filter);
};
