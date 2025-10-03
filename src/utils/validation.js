/**
 * Utility functions for data validation
 */

/**
 * Validates if a value is a valid email
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid email
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a value is a valid URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validates if a value is a valid rating (1-5)
 * @param {any} rating - The rating to validate
 * @returns {boolean} - True if valid rating
 */
export const isValidRating = (rating) => {
  const numRating = parseFloat(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};

/**
 * Validates if a value is not empty
 * @param {any} value - The value to validate
 * @returns {boolean} - True if not empty
 */
export const isNotEmpty = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value).length > 0;
  return true;
};

/**
 * Validates if a value is a valid date
 * @param {any} date - The date to validate
 * @returns {boolean} - True if valid date
 */
export const isValidDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime());
};
