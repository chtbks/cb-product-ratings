/**
 * Performance utilities for optimization
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Execute immediately on first call
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Create a memoized function
 * @param {Function} fn - Function to memoize
 * @param {Function} getKey - Function to generate cache key
 * @returns {Function} - Memoized function
 */
export const memoize = (fn, getKey = (...args) => JSON.stringify(args)) => {
  const cache = new Map();
  return (...args) => {
    const key = getKey(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for logging
 * @returns {Function} - Wrapped function
 */
export const measureTime = (fn, label = 'Function') => {
  return (...args) => {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    console.log(`${label} took ${end - start} milliseconds`);
    return result;
  };
};

/**
 * Create a lazy loader for components
 * @param {Function} importFunc - Function that returns a promise
 * @returns {Function} - Lazy component loader
 */
export const lazyLoad = (importFunc) => {
  return React.lazy(importFunc);
};

/**
 * Batch DOM updates for better performance
 * @param {Function} callback - Function to execute in batch
 */
export const batchUpdates = (callback) => {
  if (React.unstable_batchedUpdates) {
    React.unstable_batchedUpdates(callback);
  } else {
    callback();
  }
};
