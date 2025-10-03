/**
 * Utility functions for string manipulation and formatting
 */

/**
 * Capitalizes the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncates a string to a specified length with ellipsis
 * @param {string} str - The string to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} - Truncated string
 */
export const truncate = (str, maxLength = 100) => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};

/**
 * Removes HTML tags from a string
 * @param {string} htmlString - The HTML string
 * @returns {string} - Plain text string
 */
export const stripHtml = (htmlString) => {
  if (!htmlString) return '';
  return htmlString.replace(/<[^>]*>/g, '');
};

/**
 * Converts a string to a URL-friendly slug
 * @param {string} str - The string to convert
 * @returns {string} - URL-friendly slug
 */
export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
};

/**
 * Formats a number with commas
 * @param {number} num - The number to format
 * @returns {string} - Formatted number string
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return num;
  return num.toLocaleString();
};
