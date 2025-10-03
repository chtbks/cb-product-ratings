/**
 * API Service - Handles all API communications
 * Centralized API management for the application
 */

/**
 * API Service Class
 */
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_BASE_URL || '';
    this.timeout = 10000; // 10 seconds
    this.cache = new Map();
    this.requestQueue = new Map();
  }

  /**
   * Make HTTP request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const cacheKey = this.getCacheKey(url, options);
    
    // Return cached response if available
    if (options.cache !== false && this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Prevent duplicate requests
    if (this.requestQueue.has(cacheKey)) {
      return this.requestQueue.get(cacheKey);
    }

    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: this.timeout
    };

    const requestOptions = { ...defaultOptions, ...options };
    
    const promise = this.makeRequest(url, requestOptions);
    this.requestQueue.set(cacheKey, promise);

    try {
      const response = await promise;
      
      // Cache successful responses
      if (options.cache !== false && response.ok) {
        this.cache.set(cacheKey, response);
      }
      
      return response;
    } finally {
      this.requestQueue.delete(cacheKey);
    }
  }

  /**
   * Make actual HTTP request
   * @param {string} url - Full URL
   * @param {Object} options - Request options
   * @returns {Promise} - Response promise
   */
  async makeRequest(url, options) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * GET request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * PUT request
   * @param {string} endpoint - API endpoint
   * @param {Object} data - Request data
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * DELETE request
   * @param {string} endpoint - API endpoint
   * @param {Object} options - Request options
   * @returns {Promise} - API response
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Load reviews from API
   * @param {Object} params - Query parameters
   * @returns {Promise} - Reviews data
   */
  async loadReviews(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/reviews${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.get(endpoint);
      return await response.json();
    } catch (error) {
      console.error('Error loading reviews from API:', error);
      throw error;
    }
  }

  /**
   * Submit review
   * @param {Object} reviewData - Review data
   * @returns {Promise} - Submission result
   */
  async submitReview(reviewData) {
    try {
      const response = await this.post('/api/reviews', reviewData);
      return await response.json();
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  }

  /**
   * Get analytics data
   * @param {Object} params - Query parameters
   * @returns {Promise} - Analytics data
   */
  async getAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/api/analytics${queryString ? `?${queryString}` : ''}`;
      
      const response = await this.get(endpoint);
      return await response.json();
    } catch (error) {
      console.error('Error loading analytics from API:', error);
      throw error;
    }
  }

  /**
   * Get cache key for request
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   * @returns {string} - Cache key
   */
  getCacheKey(url, options) {
    const method = options.method || 'GET';
    const body = options.body ? JSON.stringify(options.body) : '';
    return `${method}_${url}_${body}`;
  }

  /**
   * Clear API cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      queueSize: this.requestQueue.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
