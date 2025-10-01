# API Integration Guide

## 🎯 API Integration Overview

This guide covers integrating the CB Product Ratings widget with various API endpoints and data sources for larger web applications.

## 📋 API Integration Scenarios

### Scenario 1: RESTful API Integration
### Scenario 2: GraphQL Integration
### Scenario 3: Microservices Architecture
### Scenario 4: Third-party API Integration

## 🔧 RESTful API Integration

### Backend API Endpoints

#### Reviews Endpoint
```javascript
// GET /api/products/:id/reviews
app.get('/api/products/:id/reviews', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, rating, search } = req.query;
    
    // Build query
    let query = { productId: id };
    
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Get reviews with pagination
    const reviews = await Review.find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Review.countDocuments(query);
    
    res.json({
      reviews: reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
```

#### Analytics Endpoint
```javascript
// GET /api/products/:id/reviews/analytics
app.get('/api/products/:id/reviews/analytics', async (req, res) => {
  try {
    const { id } = req.params;
    
    const analytics = await Review.aggregate([
      { $match: { productId: id } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          },
          recommendFriend: {
            $avg: { $cond: ['$recommendFriend', 1, 0] }
          },
          purchaseAgain: {
            $avg: { $cond: ['$purchaseAgain', 1, 0] }
          }
        }
      }
    ]);
    
    const result = analytics[0] || {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: [0, 0, 0, 0, 0],
      recommendFriend: 0,
      purchaseAgain: 0
    };
    
    // Calculate rating distribution
    const distribution = [0, 0, 0, 0, 0];
    result.ratingDistribution.forEach(rating => {
      if (rating >= 1 && rating <= 5) {
        distribution[rating - 1]++;
      }
    });
    
    res.json({
      averageRating: Math.round(result.averageRating * 10) / 10,
      totalReviews: result.totalReviews,
      ratingDistribution: distribution,
      recommendFriend: Math.round(result.recommendFriend * 100),
      purchaseAgain: Math.round(result.purchaseAgain * 100)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});
```

### Frontend API Integration

#### API Service Layer
```javascript
// services/reviewsApi.js
class ReviewsAPI {
  constructor(baseURL = '/api') {
    this.baseURL = baseURL;
  }
  
  async getReviews(productId, options = {}) {
    const params = new URLSearchParams({
      page: options.page || 1,
      limit: options.limit || 10,
      ...(options.rating && { rating: options.rating }),
      ...(options.search && { search: options.search })
    });
    
    const response = await fetch(`${this.baseURL}/products/${productId}/reviews?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  async getAnalytics(productId) {
    const response = await fetch(`${this.baseURL}/products/${productId}/reviews/analytics`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
  
  async submitReview(productId, reviewData) {
    const response = await fetch(`${this.baseURL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reviewData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }
}

export default new ReviewsAPI();
```

#### React Hook Integration
```javascript
// hooks/useReviewsAPI.js
import { useState, useEffect, useCallback } from 'react';
import reviewsAPI from '../services/reviewsApi';

export const useReviewsAPI = (productId, options = {}) => {
  const [reviews, setReviews] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0,
    total: 0
  });
  
  const fetchReviews = useCallback(async (newOptions = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await reviewsAPI.getReviews(productId, {
        ...options,
        ...newOptions
      });
      
      setReviews(data.reviews);
      setPagination({
        currentPage: data.pagination.page,
        totalPages: data.pagination.totalPages,
        total: data.pagination.total
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [productId, options]);
  
  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await reviewsAPI.getAnalytics(productId);
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  }, [productId]);
  
  useEffect(() => {
    fetchReviews();
    fetchAnalytics();
  }, [fetchReviews, fetchAnalytics]);
  
  return {
    reviews,
    analytics,
    loading,
    error,
    pagination,
    refetch: fetchReviews,
    refetchAnalytics: fetchAnalytics
  };
};
```

## 🔧 GraphQL Integration

### GraphQL Schema
```graphql
# schema.graphql
type Review {
  id: ID!
  productId: ID!
  rating: Int!
  title: String
  text: String
  author: Author!
  date: String!
  verified: Boolean!
  orderId: String
  recommendFriend: Boolean
  purchaseAgain: Boolean
}

type Author {
  name: String!
  email: String
}

type ReviewAnalytics {
  averageRating: Float!
  totalReviews: Int!
  ratingDistribution: [Int!]!
  recommendFriend: Float!
  purchaseAgain: Float!
}

type Query {
  reviews(productId: ID!, page: Int, limit: Int, rating: Int, search: String): [Review!]!
  reviewAnalytics(productId: ID!): ReviewAnalytics!
}

type Mutation {
  createReview(productId: ID!, input: ReviewInput!): Review!
  updateReview(id: ID!, input: ReviewInput!): Review!
  deleteReview(id: ID!): Boolean!
}

input ReviewInput {
  rating: Int!
  title: String
  text: String
  authorName: String!
  authorEmail: String
  recommendFriend: Boolean
  purchaseAgain: Boolean
}
```

### GraphQL Resolvers
```javascript
// resolvers.js
const resolvers = {
  Query: {
    reviews: async (parent, { productId, page = 1, limit = 10, rating, search }, context) => {
      let query = { productId };
      
      if (rating) {
        query.rating = rating;
      }
      
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { text: { $regex: search, $options: 'i' } }
        ];
      }
      
      const reviews = await Review.find(query)
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      
      return reviews;
    },
    
    reviewAnalytics: async (parent, { productId }, context) => {
      const analytics = await Review.aggregate([
        { $match: { productId } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
            ratingDistribution: { $push: '$rating' },
            recommendFriend: { $avg: { $cond: ['$recommendFriend', 1, 0] } },
            purchaseAgain: { $avg: { $cond: ['$purchaseAgain', 1, 0] } }
          }
        }
      ]);
      
      const result = analytics[0] || {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: [0, 0, 0, 0, 0],
        recommendFriend: 0,
        purchaseAgain: 0
      };
      
      return {
        averageRating: Math.round(result.averageRating * 10) / 10,
        totalReviews: result.totalReviews,
        ratingDistribution: result.ratingDistribution,
        recommendFriend: Math.round(result.recommendFriend * 100),
        purchaseAgain: Math.round(result.purchaseAgain * 100)
      };
    }
  },
  
  Mutation: {
    createReview: async (parent, { productId, input }, context) => {
      const review = new Review({
        productId,
        ...input,
        date: new Date().toISOString(),
        verified: !!input.orderId
      });
      
      return await review.save();
    }
  }
};
```

### Frontend GraphQL Integration
```javascript
// GraphQL queries
import { gql } from '@apollo/client';

export const GET_REVIEWS = gql`
  query GetReviews($productId: ID!, $page: Int, $limit: Int, $rating: Int, $search: String) {
    reviews(productId: $productId, page: $page, limit: $limit, rating: $rating, search: $search) {
      id
      rating
      title
      text
      author {
        name
        email
      }
      date
      verified
      orderId
      recommendFriend
      purchaseAgain
    }
  }
`;

export const GET_REVIEW_ANALYTICS = gql`
  query GetReviewAnalytics($productId: ID!) {
    reviewAnalytics(productId: $productId) {
      averageRating
      totalReviews
      ratingDistribution
      recommendFriend
      purchaseAgain
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview($productId: ID!, $input: ReviewInput!) {
    createReview(productId: $productId, input: $input) {
      id
      rating
      title
      text
      author {
        name
      }
      date
    }
  }
`;
```

### React Component Integration
```javascript
// components/ProductReviewsGraphQL.js
import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_REVIEWS, GET_REVIEW_ANALYTICS, CREATE_REVIEW } from '../queries/reviews';

function ProductReviewsGraphQL({ productId }) {
  const { data: reviewsData, loading: reviewsLoading, refetch } = useQuery(GET_REVIEWS, {
    variables: { productId, page: 1, limit: 10 }
  });
  
  const { data: analyticsData, loading: analyticsLoading } = useQuery(GET_REVIEW_ANALYTICS, {
    variables: { productId }
  });
  
  const [createReview] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      refetch();
    }
  });
  
  const handleSubmitReview = async (reviewData) => {
    try {
      await createReview({
        variables: {
          productId,
          input: reviewData
        }
      });
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };
  
  if (reviewsLoading || analyticsLoading) {
    return <div>Loading reviews...</div>;
  }
  
  return (
    <div className="product-reviews">
      <h2>Customer Reviews</h2>
      
      {/* Analytics Section */}
      {analyticsData?.reviewAnalytics && (
        <div className="analytics">
          <div className="average-rating">
            Average Rating: {analyticsData.reviewAnalytics.averageRating}
          </div>
          <div className="total-reviews">
            Total Reviews: {analyticsData.reviewAnalytics.totalReviews}
          </div>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="reviews-list">
        {reviewsData?.reviews?.map(review => (
          <div key={review.id} className="review-card">
            <div className="rating">{review.rating}/5</div>
            <div className="title">{review.title}</div>
            <div className="text">{review.text}</div>
            <div className="author">{review.author.name}</div>
            <div className="date">{review.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviewsGraphQL;
```

## 🔧 Microservices Integration

### Service Architecture
```javascript
// reviews-service/index.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'reviews' });
});

// Reviews endpoints
app.get('/api/reviews/:productId', async (req, res) => {
  // Implementation
});

app.post('/api/reviews/:productId', async (req, res) => {
  // Implementation
});

app.get('/api/reviews/:productId/analytics', async (req, res) => {
  // Implementation
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Reviews service running on port ${PORT}`);
});
```

### API Gateway Integration
```javascript
// api-gateway/routes.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Reviews service proxy
app.use('/api/reviews', createProxyMiddleware({
  target: process.env.REVIEWS_SERVICE_URL || 'http://localhost:3001',
  changeOrigin: true,
  pathRewrite: {
    '^/api/reviews': '/api'
  }
}));

// Products service proxy
app.use('/api/products', createProxyMiddleware({
  target: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true
}));

module.exports = app;
```

## 🔧 Third-party API Integration

### External Review Service Integration
```javascript
// services/externalReviewsAPI.js
class ExternalReviewsAPI {
  constructor(apiKey, baseURL) {
    this.apiKey = apiKey;
    this.baseURL = baseURL;
  }
  
  async getReviews(productId) {
    const response = await fetch(`${this.baseURL}/reviews/${productId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform external data to internal format
    return data.reviews.map(review => ({
      id: review.external_id,
      rating: review.star_rating,
      title: review.review_title,
      text: review.review_text,
      author: {
        name: review.reviewer_name,
        email: review.reviewer_email
      },
      date: review.review_date,
      verified: review.verified_purchase,
      orderId: review.order_id
    }));
  }
  
  async submitReview(productId, reviewData) {
    const response = await fetch(`${this.baseURL}/reviews`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        star_rating: reviewData.rating,
        review_title: reviewData.title,
        review_text: reviewData.text,
        reviewer_name: reviewData.author.name,
        reviewer_email: reviewData.author.email
      })
    });
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    return response.json();
  }
}

export default ExternalReviewsAPI;
```

## 🔧 Caching and Performance

### Redis Caching
```javascript
// services/cacheService.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

class CacheService {
  async get(key) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }
  
  async set(key, value, ttl = 3600) {
    await client.setex(key, ttl, JSON.stringify(value));
  }
  
  async del(key) {
    await client.del(key);
  }
  
  async getReviews(productId, options = {}) {
    const cacheKey = `reviews:${productId}:${JSON.stringify(options)}`;
    const cached = await this.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    // Fetch from database
    const reviews = await this.fetchReviewsFromDB(productId, options);
    
    // Cache for 1 hour
    await this.set(cacheKey, reviews, 3600);
    
    return reviews;
  }
}

export default new CacheService();
```

### CDN Integration
```javascript
// CDN configuration for static assets
const cdnConfig = {
  baseURL: process.env.CDN_URL || 'https://cdn.yourdomain.com',
  assets: {
    'chatbooks-ratings-widget.js': '/widgets/chatbooks-ratings-widget.js',
    'chatbooks-ratings-widget.css': '/widgets/chatbooks-ratings-widget.css'
  }
};

// Generate CDN URLs
const getCDNUrl = (asset) => {
  return `${cdnConfig.baseURL}${cdnConfig.assets[asset]}`;
};
```

## 🔧 Error Handling and Monitoring

### Error Handling
```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error('API Error:', err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
};

module.exports = errorHandler;
```

### API Monitoring
```javascript
// middleware/monitoring.js
const monitoring = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    // Log metrics
    console.log({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
    
    // Send to monitoring service
    if (process.env.MONITORING_URL) {
      fetch(process.env.MONITORING_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: 'reviews-api',
          method: req.method,
          endpoint: req.url,
          status: res.statusCode,
          duration,
          timestamp: new Date().toISOString()
        })
      }).catch(console.error);
    }
  });
  
  next();
};

module.exports = monitoring;
```

---

**This API integration guide provides comprehensive instructions for integrating the CB Product Ratings widget with various API architectures and data sources.**
