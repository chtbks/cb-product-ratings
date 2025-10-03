/**
 * Utility functions for date formatting and manipulation
 */

/**
 * Formats a date string into a readable format
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (dateString) => {
  try {
    return new Date(dateString).toLocaleDateString();
  } catch {
    return dateString;
  }
};

/**
 * Formats a date string with time
 * @param {string} dateString - The date string to format
 * @returns {string} - Formatted date and time string
 */
export const formatDateTime = (dateString) => {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
};

/**
 * Gets a relative time string (e.g., "2 days ago")
 * @param {string} dateString - The date string
 * @returns {string} - Relative time string
 */
export const getRelativeTime = (dateString) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch {
    return dateString;
  }
};
