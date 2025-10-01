// Application Constants
export const CONFIG = {
  REVIEWS_PER_PAGE: 10,
  DEBOUNCE_DELAY: 300,
  MAX_RETRIES: 3,
  API_TIMEOUT: 10000
};

export const COLORS = {
  TEAL: '#52DBC1',
  BLUE: '#0066cc',
  DARK_GRAY: '#333333',
  LIGHT_GRAY: '#f3f3f3',
  BORDER_GRAY: '#e3e3e3'
};

export const BREAKPOINTS = {
  MOBILE: '480px',
  TABLET: '768px',
  DESKTOP: '1024px'
};

export const VALIDATION = {
  MIN_RATING: 1,
  MAX_RATING: 5,
  MIN_REVIEW_LENGTH: 1,
  MAX_REVIEW_LENGTH: 1000
};

export const ERROR_MESSAGES = {
  CSV_LOAD_ERROR: 'Failed to load review data. Please try again later.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  VALIDATION_ERROR: 'Invalid data format detected.',
  GENERIC_ERROR: 'An unexpected error occurred.'
};
