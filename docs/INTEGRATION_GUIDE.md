# Integration Guide

## 🎯 Integration Overview

This guide provides step-by-step instructions for integrating the CB Product Ratings widget into existing applications.

## 📋 Prerequisites

- React 18+ application
- Node.js 18+
- Understanding of React hooks and components

## 🔧 Integration Methods

### Method 1: Direct Component Integration

#### 1. Copy Source Files
```bash
# Copy the entire src/ directory to your project
cp -r cb-product-ratings/src/* your-project/src/
```

#### 2. Install Dependencies
```bash
npm install papaparse prop-types
```

#### 3. Import and Use
```javascript
import React from 'react';
import App from './components/App';
import './components/App.css';

function YourApp() {
  return (
    <div>
      <h1>Your Application</h1>
      <App />
    </div>
  );
}

export default YourApp;
```

### Method 2: Widget Integration

#### 1. Build Widget Bundle
```bash
# In the cb-product-ratings directory
npm run build:widget
```

#### 2. Include in HTML
```html
<!DOCTYPE html>
<html>
<head>
  <title>Your App</title>
  <link rel="stylesheet" href="path/to/widget.css">
</head>
<body>
  <div id="your-app">
    <!-- Your existing content -->
  </div>
  
  <div id="reviews-widget"></div>
  
  <script src="path/to/chatbooks-ratings-widget.js"></script>
  <script>
    // Initialize the widget
    ChatbooksRatings.init({
      container: '#reviews-widget',
      dataSource: '/api/reviews' // or CSV path
    });
  </script>
</body>
</html>
```

### Method 3: NPM Package Integration

#### 1. Install Package
```bash
npm install cb-product-ratings
```

#### 2. Import and Use
```javascript
import React from 'react';
import { ProductRatingsWidget } from 'cb-product-ratings';

function YourApp() {
  return (
    <div>
      <h1>Your Application</h1>
      <ProductRatingsWidget 
        dataSource="/api/reviews"
        onReviewClick={(review) => console.log(review)}
      />
    </div>
  );
}
```

## 📊 Data Integration

### CSV Data Source
```javascript
// Place your CSV file in public/ directory
// The widget will automatically load from /product-ratings.csv
```

### API Data Source
```javascript
// Update useReviews.js to fetch from your API
const loadData = useCallback(async () => {
  try {
    const response = await fetch('/api/reviews');
    const data = await response.json();
    setRatings(data.reviews);
  } catch (error) {
    setError('Failed to load reviews');
  }
}, []);
```

### Custom Data Format
```javascript
// Transform your data to match expected format
const transformData = (yourData) => {
  return yourData.map(item => ({
    ID: item.id,
    Rating: item.rating.toString(),
    'Review Title': item.title,
    'Review Text': item.text,
    'Public Name': item.author,
    'Review Date': item.date,
    'URL Params': JSON.stringify({ order_id: item.orderId })
  }));
};
```

## 🎨 Styling Integration

### CSS Integration
```css
/* Import the main styles */
@import 'path/to/App.css';

/* Override styles as needed */
.custom-widget-container {
  --primary-color: #your-brand-color;
  --text-color: #your-text-color;
}
```

### Theme Customization
```javascript
// Pass theme props to customize appearance
<ProductRatingsWidget 
  theme={{
    primaryColor: '#your-brand-color',
    textColor: '#your-text-color',
    backgroundColor: '#your-bg-color'
  }}
/>
```

## 🔧 Configuration Options

### Widget Configuration
```javascript
const config = {
  // Data source
  dataSource: '/api/reviews', // or CSV path
  
  // Pagination
  itemsPerPage: 10,
  
  // Search
  enableSearch: true,
  searchPlaceholder: 'Search reviews...',
  
  // Filtering
  enableRatingFilter: true,
  
  // Analytics
  showAnalytics: true,
  showRecommendations: true,
  
  // Performance
  lazyLoading: true,
  debounceDelay: 300,
  
  // Callbacks
  onReviewClick: (review) => console.log(review),
  onFilterChange: (filter) => console.log(filter),
  onPageChange: (page) => console.log(page)
};
```

### Component Props
```javascript
// App.js props
<App 
  dataSource="/api/reviews"
  itemsPerPage={10}
  enableSearch={true}
  enableRatingFilter={true}
  showAnalytics={true}
  onReviewClick={(review) => handleReviewClick(review)}
/>

// Individual component props
<ReviewCard 
  review={reviewData}
  onReviewClick={(review) => handleReviewClick(review)}
  showVerifiedPurchase={true}
/>

<SearchFilter 
  onSearchChange={(term) => handleSearch(term)}
  onRatingChange={(rating) => handleRatingFilter(rating)}
  placeholder="Search reviews..."
/>
```

## 🚀 Performance Considerations

### Bundle Size Optimization
```javascript
// Use lazy loading for large datasets
const LazyReviewCard = lazy(() => import('./ReviewCard'));

// Implement virtual scrolling for very large datasets
import { FixedSizeList as List } from 'react-window';
```

### Caching Strategy
```javascript
// Implement data caching
const useCachedReviews = (dataSource) => {
  const [cache, setCache] = useState(new Map());
  
  const loadData = useCallback(async () => {
    if (cache.has(dataSource)) {
      return cache.get(dataSource);
    }
    
    const data = await fetch(dataSource);
    setCache(prev => new Map(prev).set(dataSource, data));
    return data;
  }, [dataSource, cache]);
  
  return { loadData };
};
```

## 🔒 Security Integration

### Input Sanitization
```javascript
// Ensure all user inputs are sanitized
import { sanitizeInput } from './utils/validation';

const handleUserInput = (input) => {
  const sanitized = sanitizeInput(input);
  // Process sanitized input
};
```

### CORS Configuration
```javascript
// Configure CORS for API endpoints
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

## 📱 Responsive Integration

### Mobile Optimization
```css
/* Ensure mobile-friendly layout */
@media (max-width: 768px) {
  .custom-widget-container {
    padding: 1rem;
  }
  
  .custom-review-card {
    margin-bottom: 1rem;
  }
}
```

### Touch Interactions
```javascript
// Add touch event handlers for mobile
const handleTouchStart = (e) => {
  // Handle touch interactions
};
```

## 🧪 Testing Integration

### Unit Testing
```javascript
import { render, screen } from '@testing-library/react';
import { App } from './App';

test('renders reviews widget', () => {
  render(<App />);
  expect(screen.getByText('Customer Reviews')).toBeInTheDocument();
});
```

### Integration Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

test('search functionality works', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText('Search reviews...');
  fireEvent.change(searchInput, { target: { value: 'great' } });
  // Assert search results
});
```

## 🔄 State Management Integration

### Redux Integration
```javascript
// Connect to Redux store
import { useSelector, useDispatch } from 'react-redux';

const ProductRatings = () => {
  const reviews = useSelector(state => state.reviews);
  const dispatch = useDispatch();
  
  return <App reviews={reviews} onReviewUpdate={(review) => 
    dispatch(updateReview(review))} />;
};
```

### Context Integration
```javascript
// Use React Context for state management
const ReviewsContext = createContext();

const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  
  return (
    <ReviewsContext.Provider value={{ reviews, setReviews }}>
      {children}
    </ReviewsContext.Provider>
  );
};
```

## 📈 Analytics Integration

### Custom Analytics
```javascript
// Track user interactions
const trackReviewClick = (review) => {
  gtag('event', 'review_click', {
    review_id: review.ID,
    rating: review.Rating
  });
};

const trackSearch = (searchTerm) => {
  gtag('event', 'search', {
    search_term: searchTerm
  });
};
```

### Performance Monitoring
```javascript
// Monitor widget performance
const measurePerformance = (componentName, renderFn) => {
  const start = performance.now();
  const result = renderFn();
  const end = performance.now();
  
  console.log(`${componentName} render time: ${end - start}ms`);
  return result;
};
```

## 🚀 Deployment Integration

### Build Configuration
```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'chatbooks-ratings-widget.js',
    library: 'ChatbooksRatings',
    libraryTarget: 'umd'
  }
};
```

### CDN Integration
```html
<!-- Include from CDN -->
<script src="https://cdn.yourdomain.com/chatbooks-ratings-widget.js"></script>
<link rel="stylesheet" href="https://cdn.yourdomain.com/widget.css">
```

## 🎯 Best Practices

### Code Organization
- Keep widget code in separate directory
- Use consistent naming conventions
- Implement proper error boundaries
- Add comprehensive documentation

### Performance
- Implement lazy loading for large datasets
- Use memoization for expensive calculations
- Optimize bundle size
- Monitor performance metrics

### Accessibility
- Ensure keyboard navigation
- Add ARIA labels
- Test with screen readers
- Maintain color contrast ratios

---

**This integration guide provides comprehensive instructions for integrating the CB Product Ratings widget into any React application.**
