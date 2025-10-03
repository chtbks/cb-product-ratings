# Webpage Integration Guide

## 🎯 Integration into Larger Web Applications

This guide specifically covers integrating the CB Product Ratings widget into existing webpages and larger applications.

## 📋 Integration Scenarios

### Scenario 1: Existing React Application
### Scenario 2: Multi-page Website
### Scenario 3: E-commerce Platform
### Scenario 4: Content Management System

## 🔧 Integration Methods for Web Applications

### Method 1: React Component Integration

#### For Existing React Apps
```javascript
// In your main React application
import React from 'react';
import { ProductRatingsWidget } from './components/ProductRatingsWidget';

function ProductPage() {
  return (
    <div className="product-page">
      <div className="product-info">
        {/* Your existing product content */}
      </div>
      
      <div className="reviews-section">
        <ProductRatingsWidget 
          productId={productId}
          dataSource={`/api/products/${productId}/reviews`}
          theme={{
            primaryColor: '#your-brand-color',
            containerClass: 'custom-reviews-container'
          }}
        />
      </div>
    </div>
  );
}
```

#### For Multi-page Applications
```javascript
// Create a dedicated reviews page
import React from 'react';
import { ProductRatingsWidget } from '../components/ProductRatingsWidget';

function ReviewsPage({ match }) {
  const productId = match.params.id;
  
  return (
    <div className="reviews-page">
      <h1>Customer Reviews</h1>
      <ProductRatingsWidget 
        productId={productId}
        dataSource={`/api/products/${productId}/reviews`}
        showAnalytics={true}
        enableSearch={true}
        enableRatingFilter={true}
      />
    </div>
  );
}
```

### Method 2: Standalone Widget Integration

#### HTML Integration
```html
<!DOCTYPE html>
<html>
<head>
  <title>Your Product Page</title>
  <link rel="stylesheet" href="path/to/your-styles.css">
  <link rel="stylesheet" href="path/to/chatbooks-ratings-widget.css">
</head>
<body>
  <div class="product-page">
    <!-- Your existing product content -->
    <div class="product-info">
      <h1>Your Product</h1>
      <p>Product description...</p>
    </div>
    
    <!-- Reviews Widget -->
    <div id="reviews-widget" class="reviews-section"></div>
  </div>
  
  <script src="path/to/chatbooks-ratings-widget.js"></script>
  <script>
    // Initialize widget
    ChatbooksRatings.init({
      container: '#reviews-widget',
      dataSource: '/api/reviews',
      theme: {
        primaryColor: '#your-brand-color',
        containerClass: 'custom-reviews-container'
      }
    });
  </script>
</body>
</html>
```

#### WordPress Integration
```php
// In your WordPress theme
function add_reviews_widget() {
    wp_enqueue_script('chatbooks-ratings', 'path/to/chatbooks-ratings-widget.js');
    wp_enqueue_style('chatbooks-ratings', 'path/to/chatbooks-ratings-widget.css');
    
    echo '<div id="reviews-widget"></div>';
    echo '<script>
        ChatbooksRatings.init({
            container: "#reviews-widget",
            dataSource: "' . get_site_url() . '/wp-json/api/v1/reviews",
            theme: {
                primaryColor: "' . get_theme_mod('primary_color', '#0066cc') . '"
            }
        });
    </script>';
}
add_action('wp_footer', 'add_reviews_widget');
```

## 🎨 Styling Integration for Web Applications

### CSS Integration Strategies

#### 1. Namespace Isolation
```css
/* Isolate widget styles to prevent conflicts */
.chatbooks-ratings-widget {
  /* All widget styles are scoped to this class */
}

.chatbooks-ratings-widget .custom-review-card {
  /* Widget-specific styles */
}

/* Override widget styles for your brand */
.chatbooks-ratings-widget {
  --primary-color: #your-brand-color;
  --text-color: #your-text-color;
  --background-color: #your-bg-color;
}
```

#### 2. Theme Integration
```css
/* Match your existing design system */
.chatbooks-ratings-widget {
  font-family: var(--your-font-family);
  border-radius: var(--your-border-radius);
  box-shadow: var(--your-box-shadow);
}

/* Responsive integration */
@media (max-width: 768px) {
  .chatbooks-ratings-widget {
    margin: 0 -1rem;
    padding: 1rem;
  }
}
```

#### 3. Layout Integration
```css
/* Integrate with your grid system */
.product-page {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.reviews-section {
  grid-column: 1 / -1;
  margin-top: 2rem;
}

/* Or flexbox integration */
.product-container {
  display: flex;
  flex-direction: column;
}

.reviews-section {
  order: 2;
  margin-top: auto;
}
```

## 📊 Data Integration for Web Applications

### API Integration Patterns

#### RESTful API Integration
```javascript
// Backend API endpoint
app.get('/api/products/:id/reviews', async (req, res) => {
  const productId = req.params.id;
  const reviews = await getProductReviews(productId);
  
  res.json({
    reviews: reviews,
    pagination: {
      total: reviews.length,
      page: 1,
      limit: 10
    }
  });
});

// Frontend integration
const useProductReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/products/${productId}/reviews`)
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews);
        setLoading(false);
      });
  }, [productId]);
  
  return { reviews, loading };
};
```

#### GraphQL Integration
```javascript
// GraphQL query
const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    product(id: $productId) {
      reviews {
        id
        rating
        title
        text
        author
        date
        verified
      }
    }
  }
`;

// Component integration
function ProductReviews({ productId }) {
  const { data, loading } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { productId }
  });
  
  if (loading) return <div>Loading reviews...</div>;
  
  return (
    <ProductRatingsWidget 
      reviews={data.product.reviews}
      productId={productId}
    />
  );
}
```

### Database Integration

#### SQL Database Schema
```sql
-- Reviews table
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  text TEXT,
  author_name VARCHAR(100),
  author_email VARCHAR(255),
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  verified_purchase BOOLEAN DEFAULT FALSE,
  order_id VARCHAR(100),
  recommend_friend BOOLEAN,
  purchase_again BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (product_id) REFERENCES products(id),
  INDEX idx_product_rating (product_id, rating),
  INDEX idx_review_date (review_date)
);
```

#### NoSQL Database (MongoDB)
```javascript
// MongoDB schema
const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  title: String,
  text: String,
  author: {
    name: String,
    email: String
  },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  orderId: String,
  recommendFriend: Boolean,
  purchaseAgain: Boolean
}, {
  timestamps: true
});
```

## 🔄 State Management Integration

### Redux Integration
```javascript
// Redux store integration
import { createSlice } from '@reduxjs/toolkit';

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    loading: false,
    error: null,
    filters: {
      rating: 'all',
      search: ''
    },
    pagination: {
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  reducers: {
    setReviews: (state, action) => {
      state.reviews = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    }
  }
});

// Component integration
function ProductReviews({ productId }) {
  const dispatch = useDispatch();
  const { reviews, loading, filters, pagination } = useSelector(state => state.reviews);
  
  useEffect(() => {
    dispatch(fetchProductReviews(productId));
  }, [productId, dispatch]);
  
  return (
    <ProductRatingsWidget 
      reviews={reviews}
      loading={loading}
      onFilterChange={(filters) => dispatch(setFilters(filters))}
      onPageChange={(page) => dispatch(setPagination({ currentPage: page }))}
    />
  );
}
```

### Context API Integration
```javascript
// Context for reviews
const ReviewsContext = createContext();

export const ReviewsProvider = ({ children, productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ rating: 'all', search: '' });
  
  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/${productId}/reviews`);
      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId]);
  
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  
  return (
    <ReviewsContext.Provider value={{
      reviews,
      loading,
      filters,
      setFilters,
      fetchReviews
    }}>
      {children}
    </ReviewsContext.Provider>
  );
};

// Usage in component
function ProductPage() {
  return (
    <ReviewsProvider productId={productId}>
      <div className="product-page">
        <ProductInfo />
        <ProductRatingsWidget />
      </div>
    </ReviewsProvider>
  );
}
```

## 🚀 Performance Optimization for Web Applications

### Lazy Loading Integration
```javascript
// Lazy load the reviews widget
import { lazy, Suspense } from 'react';

const ProductRatingsWidget = lazy(() => import('./ProductRatingsWidget'));

function ProductPage() {
  return (
    <div className="product-page">
      <ProductInfo />
      
      <Suspense fallback={<div>Loading reviews...</div>}>
        <ProductRatingsWidget productId={productId} />
      </Suspense>
    </div>
  );
}
```

### Code Splitting
```javascript
// Webpack configuration for code splitting
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        reviews: {
          test: /[\\/]node_modules[\\/]chatbooks-ratings/,
          name: 'reviews',
          chunks: 'all',
        },
      },
    },
  },
};
```

### Caching Strategies
```javascript
// Service Worker for caching
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/reviews')) {
    event.respondWith(
      caches.open('reviews-cache').then(cache => {
        return cache.match(event.request).then(response => {
          if (response) {
            return response;
          }
          return fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

## 🔒 Security Integration for Web Applications

### Authentication Integration
```javascript
// JWT authentication
const useAuthenticatedReviews = (productId) => {
  const [reviews, setReviews] = useState([]);
  const { token } = useAuth();
  
  useEffect(() => {
    if (token) {
      fetch(`/api/products/${productId}/reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => setReviews(data.reviews));
    }
  }, [productId, token]);
  
  return reviews;
};
```

### CSRF Protection
```javascript
// CSRF token integration
const useReviewsWithCSRF = () => {
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    fetch('/api/csrf-token')
      .then(res => res.json())
      .then(data => setCsrfToken(data.token));
  }, []);
  
  const submitReview = (reviewData) => {
    return fetch('/api/reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': csrfToken
      },
      body: JSON.stringify(reviewData)
    });
  };
  
  return { submitReview };
};
```

## 📱 Mobile Integration

### Responsive Design Integration
```css
/* Mobile-first responsive integration */
.product-page {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 768px) {
  .product-page {
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
}

/* Mobile-specific styles */
@media (max-width: 480px) {
  .chatbooks-ratings-widget {
    margin: 0 -1rem;
    padding: 1rem;
  }
  
  .custom-review-card {
    margin-bottom: 1rem;
    padding: 1rem;
  }
}
```

### Touch Interactions
```javascript
// Touch-friendly interactions
const useTouchInteractions = () => {
  const handleTouchStart = (e) => {
    e.currentTarget.classList.add('touch-active');
  };
  
  const handleTouchEnd = (e) => {
    e.currentTarget.classList.remove('touch-active');
  };
  
  return { handleTouchStart, handleTouchEnd };
};
```

## 🧪 Testing Integration for Web Applications

### Integration Testing
```javascript
// Cypress integration tests
describe('Product Reviews Integration', () => {
  beforeEach(() => {
    cy.visit('/products/123');
  });
  
  it('should display reviews widget', () => {
    cy.get('[data-testid="reviews-widget"]').should('be.visible');
    cy.get('[data-testid="reviews-list"]').should('contain', 'Customer Reviews');
  });
  
  it('should filter reviews by rating', () => {
    cy.get('[data-testid="rating-filter"]').select('5');
    cy.get('[data-testid="reviews-list"] .review-card').should('have.length.greaterThan', 0);
  });
  
  it('should search reviews', () => {
    cy.get('[data-testid="search-input"]').type('great product');
    cy.get('[data-testid="reviews-list"] .review-card').should('contain', 'great product');
  });
});
```

### Unit Testing
```javascript
// Jest unit tests
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductRatingsWidget } from './ProductRatingsWidget';

describe('ProductRatingsWidget', () => {
  const mockReviews = [
    { id: '1', rating: 5, title: 'Great product', text: 'Love it!' },
    { id: '2', rating: 4, title: 'Good product', text: 'Pretty good' }
  ];
  
  it('renders reviews correctly', () => {
    render(<ProductRatingsWidget reviews={mockReviews} />);
    expect(screen.getByText('Great product')).toBeInTheDocument();
    expect(screen.getByText('Good product')).toBeInTheDocument();
  });
  
  it('filters reviews by rating', () => {
    render(<ProductRatingsWidget reviews={mockReviews} />);
    fireEvent.change(screen.getByTestId('rating-filter'), { target: { value: '5' } });
    expect(screen.getByText('Great product')).toBeInTheDocument();
    expect(screen.queryByText('Good product')).not.toBeInTheDocument();
  });
});
```

## 🎯 Best Practices for Web Application Integration

### 1. Performance
- Implement lazy loading for large datasets
- Use memoization for expensive calculations
- Optimize bundle size with code splitting
- Monitor performance metrics

### 2. Security
- Sanitize all user inputs
- Implement proper authentication
- Use HTTPS for all API calls
- Validate data on both client and server

### 3. Accessibility
- Ensure keyboard navigation
- Add ARIA labels
- Test with screen readers
- Maintain color contrast ratios

### 4. SEO
- Use semantic HTML
- Implement structured data
- Optimize for search engines
- Use proper meta tags

---

**This guide provides comprehensive instructions for integrating the CB Product Ratings widget into any web application, from simple websites to complex enterprise applications.**
