// Example API endpoint for testing widget migration
// This is a simple Express.js server example

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

// Enable CORS for widget embedding
app.use(cors());
app.use(express.json());

// Mock database (replace with real database)
const mockReviews = [
  {
    id: "1",
    rating: 5,
    title: "Amazing product!",
    content: "Really love this product. Great quality and fast shipping.",
    reviewerName: "John Doe",
    reviewDate: "2024-01-15T10:30:00Z",
    verifiedPurchase: true,
    orderId: "ORD-12345"
  },
  {
    id: "2", 
    rating: 4,
    title: "Good quality",
    content: "Pretty good overall, would recommend to others.",
    reviewerName: "Jane Smith",
    reviewDate: "2024-01-10T14:20:00Z",
    verifiedPurchase: false,
    orderId: null
  },
  {
    id: "3",
    rating: 5,
    title: "Perfect!",
    content: "Exactly what I was looking for. Excellent service.",
    reviewerName: "Mike Johnson",
    reviewDate: "2024-01-08T09:15:00Z",
    verifiedPurchase: true,
    orderId: "ORD-67890"
  }
];

// Calculate stats from reviews
const calculateStats = (reviews) => {
  const totalReviews = reviews.length;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const averageRating = totalReviews > 0 ? (sum / totalReviews).toFixed(1) : 0;
  
  const distribution = {};
  for (let i = 1; i <= 5; i++) {
    distribution[i] = reviews.filter(review => review.rating === i).length;
  }
  
  return {
    totalReviews,
    averageRating: parseFloat(averageRating),
    ratingDistribution: distribution
  };
};

// API endpoint for reviews
app.get('/api/reviews', (req, res) => {
  try {
    const { productId, limit = 10, offset = 0 } = req.query;
    
    // Filter reviews by productId (in real app, query database)
    let filteredReviews = mockReviews;
    
    // Apply pagination
    const startIndex = parseInt(offset);
    const endIndex = startIndex + parseInt(limit);
    const paginatedReviews = filteredReviews.slice(startIndex, endIndex);
    
    // Calculate stats
    const stats = calculateStats(filteredReviews);
    
    // Response format
    const response = {
      reviews: paginatedReviews,
      stats: stats,
      pagination: {
        total: filteredReviews.length,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: endIndex < filteredReviews.length
      }
    };
    
    res.json(response);
    
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch reviews',
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 API server running at http://localhost:${port}`);
  console.log(`📊 Reviews endpoint: http://localhost:${port}/api/reviews`);
  console.log(`❤️  Health check: http://localhost:${port}/api/health`);
  console.log('');
  console.log('Test the API:');
  console.log(`curl "http://localhost:${port}/api/reviews?productId=123&limit=5"`);
});

module.exports = app;
