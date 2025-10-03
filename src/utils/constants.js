/**
 * Application constants and configuration
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || '',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

/**
 * Pagination Configuration
 */
export const PAGINATION_CONFIG = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  MAX_VISIBLE_PAGES: 5
};

/**
 * Rating Configuration
 */
export const RATING_CONFIG = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  DEFAULT_RATING: 0
};

/**
 * Search Configuration
 */
export const SEARCH_CONFIG = {
  MIN_SEARCH_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 1000
};

/**
 * Cache Configuration
 */
export const CACHE_CONFIG = {
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100,
  CLEANUP_INTERVAL: 10 * 60 * 1000 // 10 minutes
};

/**
 * UI Configuration
 */
export const UI_CONFIG = {
  ANIMATION_DURATION: 300,
  TOAST_DURATION: 5000,
  LOADING_TIMEOUT: 10000
};

/**
 * Color Palette
 */
export const COLORS = {
  PRIMARY: '#24B69A',
  SECONDARY: '#52DBC1',
  SUCCESS: '#28a745',
  WARNING: '#ffc107',
  DANGER: '#dc3545',
  INFO: '#17a2b8',
  LIGHT: '#f8f9fa',
  DARK: '#343a40',
  MUTED: '#6c757d'
};

/**
 * Breakpoints for responsive design
 */
export const BREAKPOINTS = {
  XS: '480px',
  SM: '768px',
  MD: '992px',
  LG: '1200px',
  XL: '1400px'
};

/**
 * Local Storage Keys
 */
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  SEARCH_HISTORY: 'search_history',
  FILTER_STATE: 'filter_state',
  THEME: 'theme'
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  LOADING_ERROR: 'Failed to load data. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.'
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  DATA_LOADED: 'Data loaded successfully.',
  SAVED: 'Changes saved successfully.',
  DELETED: 'Item deleted successfully.',
  UPDATED: 'Item updated successfully.'
};

/**
 * Feature Flags
 */
export const FEATURES = {
  ANALYTICS: process.env.REACT_APP_FEATURE_ANALYTICS === 'true',
  CACHING: process.env.REACT_APP_FEATURE_CACHING === 'true',
  OFFLINE: process.env.REACT_APP_FEATURE_OFFLINE === 'true',
  DARK_MODE: process.env.REACT_APP_FEATURE_DARK_MODE === 'true'
};
