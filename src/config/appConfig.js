/**
 * Application Configuration
 * Centralized configuration for the application
 */

import { FONTS, ASSET_PATHS } from '../assets';

/**
 * Application configuration object
 */
export const APP_CONFIG = {
  // Application metadata
  name: 'CB Product Ratings',
  version: '1.0.0',
  description: 'Product ratings and reviews widget',
  
  // Font configuration
  fonts: FONTS,
  
  // Asset paths
  assets: ASSET_PATHS,
  
  // API configuration
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || '',
    timeout: 10000,
    retries: 3
  },
  
  // Feature flags
  features: {
    analytics: process.env.REACT_APP_FEATURE_ANALYTICS === 'true',
    caching: process.env.REACT_APP_FEATURE_CACHING === 'true',
    offline: process.env.REACT_APP_FEATURE_OFFLINE === 'true',
    darkMode: process.env.REACT_APP_FEATURE_DARK_MODE === 'true'
  },
  
  // UI configuration
  ui: {
    theme: {
      primary: '#24B69A',
      secondary: '#52DBC1',
      success: '#28a745',
      warning: '#ffc107',
      danger: '#dc3545',
      info: '#17a2b8'
    },
    breakpoints: {
      xs: '480px',
      sm: '768px',
      md: '992px',
      lg: '1200px',
      xl: '1400px'
    },
    animation: {
      duration: 300,
      easing: 'ease-in-out'
    }
  },
  
  // Pagination configuration
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
    maxVisiblePages: 5
  },
  
  // Search configuration
  search: {
    minLength: 2,
    debounceDelay: 300,
    maxResults: 1000
  },
  
  // Cache configuration
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
    maxSize: 100,
    cleanupInterval: 10 * 60 * 1000 // 10 minutes
  },
  
  // Error handling
  errorHandling: {
    showToast: true,
    logErrors: true,
    retryAttempts: 3
  },
  
  // Development configuration
  development: {
    enableLogging: process.env.NODE_ENV === 'development',
    enableDevTools: process.env.NODE_ENV === 'development',
    mockData: process.env.REACT_APP_USE_MOCK_DATA === 'true'
  }
};

/**
 * Get configuration value by path
 * @param {string} path - Dot notation path
 * @param {any} defaultValue - Default value
 * @returns {any} - Configuration value
 */
export const getConfig = (path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = APP_CONFIG;
  
  for (const key of keys) {
    if (result === null || result === undefined || !(key in result)) {
      return defaultValue;
    }
    result = result[key];
  }
  
  return result;
};

/**
 * Update configuration value
 * @param {string} path - Dot notation path
 * @param {any} value - New value
 */
export const setConfig = (path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  let current = APP_CONFIG;
  
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

export default APP_CONFIG;
