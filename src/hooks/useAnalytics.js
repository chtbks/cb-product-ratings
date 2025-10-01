import { useMemo } from 'react';

export const useAnalytics = (ratings) => {
  return useMemo(() => {
    if (!ratings || ratings.length === 0) {
      return {
        totalReviews: 0,
        averageRating: 0,
        ratingDistribution: {},
        recommendFriendStats: {
          totalResponses: 0,
          recommendRate: 0,
          recommendDistribution: {},
          recommendByRating: {}
        },
        purchaseAgainStats: {
          totalResponses: 0,
          purchaseAgainRate: 0,
          purchaseAgainDistribution: {},
          purchaseAgainByRating: {}
        }
      };
    }

    const totalReviews = ratings.length;
    const ratingsArray = ratings.map(row => parseInt(row.Rating)).filter(rating => !isNaN(rating));
    const averageRating = ratingsArray.reduce((sum, rating) => sum + rating, 0) / ratingsArray.length;
    
    const ratingDistribution = {};
    ratingsArray.forEach(rating => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    // Calculate Recommend Friend analytics
    const recommendFriendData = ratings.map(row => ({
      rating: parseInt(row.Rating),
      recommendFriend: parseInt(row['Recommend Friend?']) || 0
    })).filter(item => !isNaN(item.recommendFriend) && !isNaN(item.rating));

    const totalRecommendResponses = recommendFriendData.length;
    const recommendCount = recommendFriendData.filter(item => item.recommendFriend >= 2).length;
    const recommendRate = totalRecommendResponses > 0 ? (recommendCount / totalRecommendResponses) * 100 : 0;

    // Recommend Friend distribution (1-5 scale)
    const recommendDistribution = {};
    for (let i = 1; i <= 5; i++) {
      recommendDistribution[i] = recommendFriendData.filter(item => item.recommendFriend === i).length;
    }

    // Recommend Friend by Rating correlation
    const recommendByRating = {};
    for (let rating = 1; rating <= 5; rating++) {
      const ratingData = recommendFriendData.filter(item => item.rating === rating);
      const ratingRecommendCount = ratingData.filter(item => item.recommendFriend >= 2).length;
      recommendByRating[rating] = {
        total: ratingData.length,
        recommend: ratingRecommendCount,
        rate: ratingData.length > 0 ? (ratingRecommendCount / ratingData.length) * 100 : 0
      };
    }

    // Calculate Purchase Again analytics
    const purchaseAgainData = ratings.map(row => ({
      rating: parseInt(row.Rating),
      purchaseAgain: parseInt(row['Purchase Again?']) || 0
    })).filter(item => !isNaN(item.purchaseAgain) && !isNaN(item.rating));

    const totalPurchaseAgainResponses = purchaseAgainData.length;
    const purchaseAgainCount = purchaseAgainData.filter(item => item.purchaseAgain >= 2).length;
    const purchaseAgainRate = totalPurchaseAgainResponses > 0 ? (purchaseAgainCount / totalPurchaseAgainResponses) * 100 : 0;

    // Purchase Again distribution (1-5 scale)
    const purchaseAgainDistribution = {};
    for (let i = 1; i <= 5; i++) {
      purchaseAgainDistribution[i] = purchaseAgainData.filter(item => item.purchaseAgain === i).length;
    }

    // Purchase Again by Rating correlation
    const purchaseAgainByRating = {};
    for (let rating = 1; rating <= 5; rating++) {
      const ratingData = purchaseAgainData.filter(item => item.rating === rating);
      const ratingPurchaseAgainCount = ratingData.filter(item => item.purchaseAgain >= 2).length;
      purchaseAgainByRating[rating] = {
        total: ratingData.length,
        purchaseAgain: ratingPurchaseAgainCount,
        rate: ratingData.length > 0 ? (ratingPurchaseAgainCount / ratingData.length) * 100 : 0
      };
    }

    return {
      totalReviews,
      averageRating: averageRating.toFixed(1),
      ratingDistribution,
      recommendFriendStats: {
        totalResponses: totalRecommendResponses,
        recommendRate: Math.round(recommendRate * 10) / 10,
        recommendDistribution,
        recommendByRating
      },
      purchaseAgainStats: {
        totalResponses: totalPurchaseAgainResponses,
        purchaseAgainRate: Math.round(purchaseAgainRate * 10) / 10,
        purchaseAgainDistribution,
        purchaseAgainByRating
      }
    };
  }, [ratings]);
};
