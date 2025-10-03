/**
 * Data Service - Handles all data operations
 * Centralized data management for the application
 */

import Papa from 'papaparse';

/**
 * Configuration for CSV parsing
 */
const CSV_CONFIG = {
  header: true,
  skipEmptyLines: true,
  transformHeader: (header) => header.trim(),
  transform: (value) => value?.trim() || ''
};

/**
 * Data Service Class
 */
class DataService {
  constructor() {
    this.cache = new Map();
    this.loading = new Map();
  }

  /**
   * Load CSV data from URL
   * @param {string} url - CSV file URL
   * @param {Object} options - Additional options
   * @returns {Promise<Array>} - Parsed data array
   */
  async loadCSV(url, options = {}) {
    const cacheKey = `csv_${url}`;
    
    // Return cached data if available
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Prevent duplicate requests
    if (this.loading.has(cacheKey)) {
      return this.loading.get(cacheKey);
    }

    const config = { ...CSV_CONFIG, ...options };
    
    const promise = new Promise((resolve, reject) => {
      Papa.parse(url, {
        ...config,
        download: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          
          const data = results.data.filter(row => {
            // Filter out empty rows and rows without required fields
            return row && Object.keys(row).length > 0 && row.ID;
          });
          
          this.cache.set(cacheKey, data);
          this.loading.delete(cacheKey);
          resolve(data);
        },
        error: (error) => {
          this.loading.delete(cacheKey);
          reject(new Error(`Failed to load CSV data: ${error.message}`));
        }
      });
    });

    this.loading.set(cacheKey, promise);
    return promise;
  }

  /**
   * Load product ratings data
   * @returns {Promise<Array>} - Product ratings array
   */
  async loadProductRatings() {
    try {
      const data = await this.loadCSV('/product-ratings.csv');
      return data.map(this.transformRatingData);
    } catch (error) {
      console.error('Error loading product ratings:', error);
      throw error;
    }
  }

  /**
   * Transform raw rating data
   * @param {Object} rawData - Raw CSV row data
   * @returns {Object} - Transformed rating data
   */
  transformRatingData(rawData) {
    return {
      ...rawData,
      Rating: parseFloat(rawData.Rating) || 0,
      'Recommend Friend?': parseInt(rawData['Recommend Friend?']) || 0,
      'Purchase Again?': parseInt(rawData['Purchase Again?']) || 0,
      'Review Date': rawData['Review Date'] ? new Date(rawData['Review Date']) : null
    };
  }

  /**
   * Filter data by search term
   * @param {Array} data - Data array
   * @param {string} searchTerm - Search term
   * @returns {Array} - Filtered data
   */
  filterBySearch(data, searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return data;
    }

    const term = searchTerm.toLowerCase().trim();
    return data.filter(item => 
      item['Review Title']?.toLowerCase().includes(term) ||
      item['Review Text']?.toLowerCase().includes(term) ||
      item['Public Name']?.toLowerCase().includes(term)
    );
  }

  /**
   * Filter data by rating
   * @param {Array} data - Data array
   * @param {string|number} ratingFilter - Rating filter
   * @returns {Array} - Filtered data
   */
  filterByRating(data, ratingFilter) {
    if (ratingFilter === 'all' || !ratingFilter) {
      return data;
    }
    
    const rating = parseInt(ratingFilter);
    return data.filter(item => item.Rating === rating);
  }

  /**
   * Sort data by date (newest first)
   * @param {Array} data - Data array
   * @returns {Array} - Sorted data
   */
  sortByDate(data) {
    return [...data].sort((a, b) => {
      const dateA = new Date(a['Review Date'] || 0);
      const dateB = new Date(b['Review Date'] || 0);
      return dateB - dateA;
    });
  }

  /**
   * Get paginated data
   * @param {Array} data - Data array
   * @param {number} page - Page number (1-based)
   * @param {number} pageSize - Items per page
   * @returns {Object} - Paginated result
   */
  getPaginatedData(data, page = 1, pageSize = 10) {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const totalPages = Math.ceil(data.length / pageSize);
    
    return {
      data: data.slice(startIndex, endIndex),
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: data.length,
        pageSize,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
    this.loading.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} - Cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.cache.size,
      loadingCount: this.loading.size,
      cacheKeys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const dataService = new DataService();
export default dataService;
