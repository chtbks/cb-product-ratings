/**
 * Analytics Service - Handles all analytics calculations
 * Centralized analytics logic for the application
 */

/**
 * Analytics Service Class
 */
class AnalyticsService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Calculate comprehensive analytics for ratings data
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Analytics results
   */
  calculateAnalytics(ratings) {
    if (!ratings || ratings.length === 0) {
      return this.getEmptyAnalytics();
    }

    const cacheKey = this.getCacheKey(ratings);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const analytics = {
      basic: this.calculateBasicStats(ratings),
      distribution: this.calculateRatingDistribution(ratings),
      recommendFriend: this.calculateRecommendFriendStats(ratings),
      purchaseAgain: this.calculatePurchaseAgainStats(ratings),
      trends: this.calculateTrends(ratings)
    };

    this.cache.set(cacheKey, analytics);
    return analytics;
  }

  /**
   * Calculate basic statistics
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Basic statistics
   */
  calculateBasicStats(ratings) {
    const validRatings = ratings
      .map(r => parseFloat(r.Rating))
      .filter(rating => !isNaN(rating) && rating > 0);

    if (validRatings.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        medianRating: 0,
        standardDeviation: 0
      };
    }

    const totalReviews = validRatings.length;
    const averageRating = validRatings.reduce((sum, rating) => sum + rating, 0) / totalReviews;
    
    // Calculate median
    const sortedRatings = [...validRatings].sort((a, b) => a - b);
    const medianRating = sortedRatings.length % 2 === 0
      ? (sortedRatings[sortedRatings.length / 2 - 1] + sortedRatings[sortedRatings.length / 2]) / 2
      : sortedRatings[Math.floor(sortedRatings.length / 2)];

    // Calculate standard deviation
    const variance = validRatings.reduce((sum, rating) => sum + Math.pow(rating - averageRating, 2), 0) / totalReviews;
    const standardDeviation = Math.sqrt(variance);

    return {
      totalReviews,
      averageRating: Math.round(averageRating * 10) / 10,
      medianRating: Math.round(medianRating * 10) / 10,
      standardDeviation: Math.round(standardDeviation * 100) / 100
    };
  }

  /**
   * Calculate rating distribution
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Rating distribution
   */
  calculateRatingDistribution(ratings) {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    ratings.forEach(rating => {
      const ratingValue = parseInt(rating.Rating);
      if (ratingValue >= 1 && ratingValue <= 5) {
        distribution[ratingValue]++;
      }
    });

    const total = ratings.length;
    const percentages = {};
    Object.keys(distribution).forEach(rating => {
      percentages[rating] = total > 0 ? Math.round((distribution[rating] / total) * 100) : 0;
    });

    return {
      counts: distribution,
      percentages,
      total
    };
  }

  /**
   * Calculate recommend friend statistics
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Recommend friend statistics
   */
  calculateRecommendFriendStats(ratings) {
    const recommendData = ratings
      .map(r => ({
        rating: parseInt(r.Rating),
        recommendFriend: parseInt(r['Recommend Friend?']) || 0
      }))
      .filter(item => !isNaN(item.recommendFriend) && !isNaN(item.rating));

    if (recommendData.length === 0) {
      return this.getEmptyRecommendStats();
    }

    const totalResponses = recommendData.length;
    const recommendCount = recommendData.filter(item => item.recommendFriend >= 2).length;
    const recommendRate = (recommendCount / totalResponses) * 100;

    // Calculate by rating
    const byRating = {};
    for (let rating = 1; rating <= 5; rating++) {
      const ratingData = recommendData.filter(item => item.rating === rating);
      const ratingRecommendCount = ratingData.filter(item => item.recommendFriend >= 2).length;
      byRating[rating] = {
        total: ratingData.length,
        recommend: ratingRecommendCount,
        rate: ratingData.length > 0 ? (ratingRecommendCount / ratingData.length) * 100 : 0
      };
    }

    return {
      totalResponses,
      recommendCount,
      recommendRate: Math.round(recommendRate * 10) / 10,
      byRating
    };
  }

  /**
   * Calculate purchase again statistics
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Purchase again statistics
   */
  calculatePurchaseAgainStats(ratings) {
    const purchaseAgainData = ratings
      .map(r => ({
        rating: parseInt(r.Rating),
        purchaseAgain: parseInt(r['Purchase Again?']) || 0
      }))
      .filter(item => !isNaN(item.purchaseAgain) && !isNaN(item.rating));

    if (purchaseAgainData.length === 0) {
      return this.getEmptyPurchaseAgainStats();
    }

    const totalResponses = purchaseAgainData.length;
    const purchaseAgainCount = purchaseAgainData.filter(item => item.purchaseAgain >= 2).length;
    const purchaseAgainRate = (purchaseAgainCount / totalResponses) * 100;

    // Calculate by rating
    const byRating = {};
    for (let rating = 1; rating <= 5; rating++) {
      const ratingData = purchaseAgainData.filter(item => item.rating === rating);
      const ratingPurchaseAgainCount = ratingData.filter(item => item.purchaseAgain >= 2).length;
      byRating[rating] = {
        total: ratingData.length,
        purchaseAgain: ratingPurchaseAgainCount,
        rate: ratingData.length > 0 ? (ratingPurchaseAgainCount / ratingData.length) * 100 : 0
      };
    }

    return {
      totalResponses,
      purchaseAgainCount,
      purchaseAgainRate: Math.round(purchaseAgainRate * 10) / 10,
      byRating
    };
  }

  /**
   * Calculate trends over time
   * @param {Array} ratings - Array of rating objects
   * @returns {Object} - Trend analysis
   */
  calculateTrends(ratings) {
    const ratingsWithDates = ratings
      .filter(r => r['Review Date'])
      .map(r => ({
        ...r,
        date: new Date(r['Review Date']),
        rating: parseInt(r.Rating)
      }))
      .filter(item => !isNaN(item.date.getTime()) && !isNaN(item.rating))
      .sort((a, b) => a.date - b.date);

    if (ratingsWithDates.length === 0) {
      return { monthly: [], quarterly: [], yearly: [] };
    }

    // Group by month
    const monthly = this.groupByTimeframe(ratingsWithDates, 'month');
    const quarterly = this.groupByTimeframe(ratingsWithDates, 'quarter');
    const yearly = this.groupByTimeframe(ratingsWithDates, 'year');

    return { monthly, quarterly, yearly };
  }

  /**
   * Group ratings by timeframe
   * @param {Array} ratings - Array of rating objects with dates
   * @param {string} timeframe - 'month', 'quarter', or 'year'
   * @returns {Array} - Grouped data
   */
  groupByTimeframe(ratings, timeframe) {
    const groups = {};
    
    ratings.forEach(rating => {
      let key;
      const date = rating.date;
      
      switch (timeframe) {
        case 'month':
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
        case 'quarter':
          const quarter = Math.floor(date.getMonth() / 3) + 1;
          key = `${date.getFullYear()}-Q${quarter}`;
          break;
        case 'year':
          key = date.getFullYear().toString();
          break;
        default:
          return;
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(rating);
    });

    return Object.keys(groups).map(key => ({
      period: key,
      ratings: groups[key],
      averageRating: groups[key].reduce((sum, r) => sum + r.rating, 0) / groups[key].length,
      count: groups[key].length
    }));
  }

  /**
   * Get empty analytics object
   * @returns {Object} - Empty analytics
   */
  getEmptyAnalytics() {
    return {
      basic: {
        totalReviews: 0,
        averageRating: 0,
        medianRating: 0,
        standardDeviation: 0
      },
      distribution: {
        counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        total: 0
      },
      recommendFriend: this.getEmptyRecommendStats(),
      purchaseAgain: this.getEmptyPurchaseAgainStats(),
      trends: { monthly: [], quarterly: [], yearly: [] }
    };
  }

  /**
   * Get empty recommend stats
   * @returns {Object} - Empty recommend stats
   */
  getEmptyRecommendStats() {
    return {
      totalResponses: 0,
      recommendCount: 0,
      recommendRate: 0,
      byRating: {}
    };
  }

  /**
   * Get empty purchase again stats
   * @returns {Object} - Empty purchase again stats
   */
  getEmptyPurchaseAgainStats() {
    return {
      totalResponses: 0,
      purchaseAgainCount: 0,
      purchaseAgainRate: 0,
      byRating: {}
    };
  }

  /**
   * Generate cache key for ratings
   * @param {Array} ratings - Array of rating objects
   * @returns {string} - Cache key
   */
  getCacheKey(ratings) {
    return `analytics_${ratings.length}_${ratings.map(r => r.ID).join('_')}`;
  }

  /**
   * Clear analytics cache
   */
  clearCache() {
    this.cache.clear();
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
export default analyticsService;
