# API Migration Guide: CSV to API Endpoint

## 🔄 Overview

This guide covers migrating the Chatbooks Ratings Widget from CSV data to an internal API endpoint. This is the recommended production approach for better performance, security, and scalability.

## 📊 Current State vs Future State

### Current (CSV-based)
```javascript
// Widget loads data from CSV file
Papa.parse('/product-ratings.csv', {
  download: true,
  header: true,
  complete: (results) => {
    // Process CSV data
  }
});
```

### Future (API-based)
```javascript
// Widget loads data from API endpoint
fetch('/api/reviews?productId=123')
  .then(response => response.json())
  .then(data => {
    // Process API data
  });
```

---

## 🚀 Migration Steps

### Step 1: Create API Endpoint

#### Backend API Structure
```javascript
// Example Express.js endpoint
app.get('/api/reviews', async (req, res) => {
  const { productId, limit = 10, offset = 0 } = req.query;
  
  try {
    const reviews = await getReviewsFromDatabase(productId, limit, offset);
    const stats = await getReviewStats(productId);
    
    res.json({
      reviews: reviews,
      stats: stats,
      pagination: {
        total: await getTotalReviews(productId),
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
```

#### API Response Format
```json
{
  "reviews": [
    {
      "id": "123",
      "rating": 5,
      "title": "Amazing product!",
      "content": "Really love this product...",
      "reviewerName": "John Doe",
      "reviewDate": "2024-01-15T10:30:00Z",
      "verifiedPurchase": true,
      "orderId": "ORD-12345"
    }
  ],
  "stats": {
    "totalReviews": 150,
    "averageRating": 4.2,
    "ratingDistribution": {
      "5": 45,
      "4": 30,
      "3": 15,
      "2": 5,
      "1": 5
    }
  },
  "pagination": {
    "total": 150,
    "limit": 10,
    "offset": 0
  }
}
```

### Step 2: Update Widget Component

#### Modified Widget.js
```javascript
// Replace CSV loading with API loading
useEffect(() => {
  const loadReviews = async () => {
    try {
      setLoading(true);
      
      // Build API URL with configuration
      const apiUrl = `${finalConfig.apiBaseUrl || '/api'}/reviews`;
      const params = new URLSearchParams({
        productId: finalConfig.productId,
        limit: finalConfig.maxReviews.toString()
      });
      
      const response = await fetch(`${apiUrl}?${params}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Process API data (same format as CSV)
      setReviews(data.reviews);
      setFilteredReviews(data.reviews);
      setStats(data.stats);
      setLoading(false);
      
    } catch (error) {
      console.error('Error loading reviews from API:', error);
      setLoading(false);
      
      // Fallback to CSV if API fails
      if (finalConfig.fallbackToCsv) {
        loadFromCsv();
      }
    }
  };
  
  loadReviews();
}, [finalConfig.productId, finalConfig.apiBaseUrl]);

// Keep CSV fallback function
const loadFromCsv = () => {
  Papa.parse('/product-ratings.csv', {
    download: true,
    header: true,
    complete: (results) => {
      const data = results.data.filter(row => row.ID && row.Rating);
      setReviews(data);
      setFilteredReviews(data);
      calculateStats(data);
      setLoading(false);
    }
  });
};
```

### Step 3: Update Configuration Options

#### Enhanced Widget Configuration
```javascript
// New configuration options for API
const defaultConfig = {
  // Existing options...
  productId: 'default',
  theme: 'light',
  showSearch: true,
  showFilters: true,
  maxReviews: 10,
  
  // New API options
  apiBaseUrl: '/api',                    // API base URL
  apiEndpoint: '/reviews',               // Reviews endpoint
  apiTimeout: 5000,                     // Request timeout (ms)
  fallbackToCsv: true,                  // Fallback to CSV if API fails
  enablePagination: false,              // Enable pagination
  cacheResults: true,                   // Cache API results
  cacheTimeout: 300000,                 // Cache timeout (5 minutes)
  
  // Authentication (if needed)
  apiKey: null,                         // API key for authentication
  apiHeaders: {},                       // Custom headers
  
  // Error handling
  showApiErrors: false,                // Show API errors to users
  retryAttempts: 3,                     // Number of retry attempts
  retryDelay: 1000                      // Delay between retries (ms)
};
```

### Step 4: Add API Error Handling

#### Enhanced Error Handling
```javascript
const [apiError, setApiError] = useState(null);
const [retryCount, setRetryCount] = useState(0);

const loadReviewsWithRetry = async (attempt = 1) => {
  try {
    setApiError(null);
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...finalConfig.apiHeaders
      },
      timeout: finalConfig.apiTimeout
    });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    // Process data...
    
  } catch (error) {
    console.error(`API attempt ${attempt} failed:`, error);
    
    if (attempt < finalConfig.retryAttempts) {
      // Retry with exponential backoff
      setTimeout(() => {
        setRetryCount(attempt);
        loadReviewsWithRetry(attempt + 1);
      }, finalConfig.retryDelay * attempt);
    } else {
      // All retries failed
      setApiError(error.message);
      if (finalConfig.fallbackToCsv) {
        loadFromCsv();
      }
    }
  }
};
```

### Step 5: Add Caching Layer

#### Simple Caching Implementation
```javascript
const [cache, setCache] = useState({});

const getCachedData = (key) => {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < finalConfig.cacheTimeout) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  setCache(prev => ({
    ...prev,
    [key]: {
      data,
      timestamp: Date.now()
    }
  }));
};

const loadReviews = async () => {
  const cacheKey = `reviews-${finalConfig.productId}`;
  const cachedData = getCachedData(cacheKey);
  
  if (cachedData && finalConfig.cacheResults) {
    setReviews(cachedData.reviews);
    setStats(cachedData.stats);
    setLoading(false);
    return;
  }
  
  // Load from API...
  const data = await fetchFromAPI();
  setCachedData(cacheKey, data);
};
```

---

## 🔧 Implementation Examples

### Example 1: Simple API Integration
```javascript
// Initialize widget with API
window.ChatbooksRatings.init({
  containerId: 'chatbooks-ratings-widget',
  productId: 'product-123',
  apiBaseUrl: 'https://api.yourcompany.com',
  apiEndpoint: '/reviews',
  maxReviews: 20,
  fallbackToCsv: true
});
```

### Example 2: Authenticated API
```javascript
// Initialize with authentication
window.ChatbooksRatings.init({
  containerId: 'chatbooks-ratings-widget',
  productId: 'product-123',
  apiBaseUrl: 'https://api.yourcompany.com',
  apiKey: 'your-api-key',
  apiHeaders: {
    'Authorization': 'Bearer your-token',
    'X-Client-ID': 'widget-v1'
  }
});
```

### Example 3: Production Configuration
```javascript
// Production-ready configuration
window.ChatbooksRatings.init({
  containerId: 'chatbooks-ratings-widget',
  productId: 'product-123',
  apiBaseUrl: 'https://api.yourcompany.com',
  apiTimeout: 10000,
  cacheResults: true,
  cacheTimeout: 600000, // 10 minutes
  retryAttempts: 3,
  retryDelay: 2000,
  fallbackToCsv: false, // Disable CSV fallback in production
  showApiErrors: true
});
```

---

## 🧪 Testing Migration

### Step 1: Test API Endpoint
```bash
# Test API endpoint directly
curl "https://api.yourcompany.com/reviews?productId=123&limit=10"

# Expected response:
{
  "reviews": [...],
  "stats": {...},
  "pagination": {...}
}
```

### Step 2: Test Widget with API
```javascript
// Test widget initialization
window.ChatbooksRatings.init({
  containerId: 'test-widget',
  productId: 'test-product',
  apiBaseUrl: 'https://api.yourcompany.com',
  showApiErrors: true
});
```

### Step 3: Test Error Handling
```javascript
// Test with invalid API URL
window.ChatbooksRatings.init({
  containerId: 'test-widget',
  productId: 'test-product',
  apiBaseUrl: 'https://invalid-api.com',
  fallbackToCsv: true
});
```

---

## 📊 Performance Considerations

### API Optimization
```javascript
// Implement request debouncing
const debouncedSearch = useCallback(
  debounce((searchTerm) => {
    if (searchTerm.length > 2) {
      searchReviews(searchTerm);
    }
  }, 300),
  []
);

// Implement pagination
const loadMoreReviews = async () => {
  const nextPage = Math.floor(reviews.length / finalConfig.maxReviews) + 1;
  const response = await fetch(`${apiUrl}?offset=${nextPage * finalConfig.maxReviews}`);
  const newData = await response.json();
  setReviews(prev => [...prev, ...newData.reviews]);
};
```

### Caching Strategy
```javascript
// Implement smart caching
const getCacheKey = (productId, filters) => {
  return `reviews-${productId}-${JSON.stringify(filters)}`;
};

// Cache invalidation
const invalidateCache = (productId) => {
  const keys = Object.keys(cache).filter(key => key.includes(productId));
  keys.forEach(key => delete cache[key]);
};
```

---

## 🔒 Security Considerations

### API Security
```javascript
// Add CSRF protection
const apiHeaders = {
  'X-CSRF-Token': getCsrfToken(),
  'X-Requested-With': 'XMLHttpRequest'
};

// Add rate limiting
const rateLimit = {
  requests: 0,
  window: Date.now(),
  maxRequests: 100
};

const checkRateLimit = () => {
  const now = Date.now();
  if (now - rateLimit.window > 60000) { // Reset every minute
    rateLimit.requests = 0;
    rateLimit.window = now;
  }
  return rateLimit.requests < rateLimit.maxRequests;
};
```

### Data Validation
```javascript
// Validate API response
const validateApiResponse = (data) => {
  if (!data.reviews || !Array.isArray(data.reviews)) {
    throw new Error('Invalid API response: missing reviews array');
  }
  
  if (!data.stats || typeof data.stats.averageRating !== 'number') {
    throw new Error('Invalid API response: missing stats');
  }
  
  return true;
};
```

---

## 📈 Monitoring & Analytics

### API Monitoring
```javascript
// Track API performance
const trackApiPerformance = (startTime, endpoint) => {
  const duration = Date.now() - startTime;
  
  // Send to analytics
  gtag('event', 'api_request', {
    'event_category': 'performance',
    'event_label': endpoint,
    'value': duration
  });
};

// Track errors
const trackApiError = (error, endpoint) => {
  gtag('event', 'api_error', {
    'event_category': 'error',
    'event_label': endpoint,
    'value': error.status || 0
  });
};
```

---

## 🚀 Deployment Checklist

### Pre-Migration
- [ ] API endpoint tested and working
- [ ] Data format matches widget expectations
- [ ] Error handling implemented
- [ ] Caching strategy defined
- [ ] Security measures in place

### Migration
- [ ] Update widget configuration
- [ ] Deploy API endpoint
- [ ] Update widget deployment
- [ ] Test in staging environment
- [ ] Monitor performance

### Post-Migration
- [ ] Monitor API usage
- [ ] Track error rates
- [ ] Optimize performance
- [ ] Update documentation
- [ ] Train support team

---

## 🔄 Rollback Plan

### Quick Rollback
```javascript
// Revert to CSV fallback
window.ChatbooksRatings.init({
  containerId: 'chatbooks-ratings-widget',
  productId: 'product-123',
  apiBaseUrl: 'https://api.yourcompany.com',
  fallbackToCsv: true, // Enable CSV fallback
  showApiErrors: false // Hide API errors
});
```

### Emergency Rollback
```javascript
// Force CSV-only mode
window.ChatbooksRatings.init({
  containerId: 'chatbooks-ratings-widget',
  productId: 'product-123',
  apiBaseUrl: null, // Disable API
  fallbackToCsv: true
});
```

---

## 📞 Support

### Common Issues
1. **API not responding** → Check network, enable fallback
2. **Data format mismatch** → Validate API response format
3. **Authentication errors** → Check API keys and headers
4. **Performance issues** → Enable caching, optimize queries

### Debugging
```javascript
// Enable debug mode
window.ChatbooksRatings.init({
  // ... config
  debug: true,
  showApiErrors: true
});
```

**Ready for API migration!** 🚀
