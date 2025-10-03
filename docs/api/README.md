# API Documentation

This document provides comprehensive API documentation for the CB Product Ratings Widget.

## 🔌 Service Layer APIs

### Data Service

The `dataService` handles all data operations including CSV loading, filtering, and caching.

#### Methods

##### `loadProductRatings()`
Loads product ratings from CSV data.

```javascript
import { dataService } from '../services';

const ratings = await dataService.loadProductRatings();
```

**Returns:** `Promise<Array>` - Array of rating objects

**Example Response:**
```javascript
[
  {
    ID: "1",
    "Review Title": "Great product!",
    Rating: 5,
    "Review Text": "I love this product...",
    "Public Name": "John D.",
    "Review Date": "2024-01-15",
    "Recommend Friend?": 4,
    "Purchase Again?": 5
  }
]
```

##### `filterBySearch(data, searchTerm)`
Filters data by search term.

```javascript
const filteredData = dataService.filterBySearch(ratings, "great product");
```

**Parameters:**
- `data` (Array): Data to filter
- `searchTerm` (string): Search term

**Returns:** `Array` - Filtered data

##### `filterByRating(data, ratingFilter)`
Filters data by rating.

```javascript
const fiveStarRatings = dataService.filterByRating(ratings, 5);
```

**Parameters:**
- `data` (Array): Data to filter
- `ratingFilter` (string|number): Rating to filter by

**Returns:** `Array` - Filtered data

##### `getPaginatedData(data, page, pageSize)`
Gets paginated data.

```javascript
const paginated = dataService.getPaginatedData(ratings, 1, 10);
```

**Parameters:**
- `data` (Array): Data to paginate
- `page` (number): Page number (1-based)
- `pageSize` (number): Items per page

**Returns:** `Object` - Paginated result with data and pagination info

### Analytics Service

The `analyticsService` handles all analytics calculations.

#### Methods

##### `calculateAnalytics(ratings)`
Calculates comprehensive analytics for ratings data.

```javascript
import { analyticsService } from '../services';

const analytics = analyticsService.calculateAnalytics(ratings);
```

**Parameters:**
- `ratings` (Array): Array of rating objects

**Returns:** `Object` - Analytics results

**Example Response:**
```javascript
{
  basic: {
    totalReviews: 100,
    averageRating: 4.2,
    medianRating: 4.0,
    standardDeviation: 1.1
  },
  distribution: {
    counts: { 1: 5, 2: 10, 3: 20, 4: 35, 5: 30 },
    percentages: { 1: 5, 2: 10, 3: 20, 4: 35, 5: 30 },
    total: 100
  },
  recommendFriend: {
    totalResponses: 95,
    recommendCount: 78,
    recommendRate: 82.1,
    byRating: { /* detailed breakdown */ }
  },
  purchaseAgain: {
    totalResponses: 95,
    purchaseAgainCount: 72,
    purchaseAgainRate: 75.8,
    byRating: { /* detailed breakdown */ }
  },
  trends: {
    monthly: [ /* monthly trends */ ],
    quarterly: [ /* quarterly trends */ ],
    yearly: [ /* yearly trends */ ]
  }
}
```

### API Service

The `apiService` handles HTTP requests and API communications.

#### Methods

##### `get(endpoint, options)`
Makes GET request.

```javascript
import { apiService } from '../services';

const response = await apiService.get('/api/reviews');
```

##### `post(endpoint, data, options)`
Makes POST request.

```javascript
const response = await apiService.post('/api/reviews', reviewData);
```

##### `loadReviews(params)`
Loads reviews from API.

```javascript
const reviews = await apiService.loadReviews({ page: 1, limit: 10 });
```

##### `getAnalytics(params)`
Gets analytics data from API.

```javascript
const analytics = await apiService.getAnalytics({ period: 'monthly' });
```

## 🎣 Custom Hooks

### useReviews

Hook for managing review data.

```javascript
import { useReviews } from '../hooks';

const { ratings, loading, error } = useReviews();
```

**Returns:**
- `ratings` (Array): Array of rating objects
- `loading` (boolean): Loading state
- `error` (string|null): Error message

### useAnalytics

Hook for analytics calculations.

```javascript
import { useAnalytics } from '../hooks';

const analytics = useAnalytics(ratings);
```

**Parameters:**
- `ratings` (Array): Array of rating objects

**Returns:** `Object` - Analytics results

### usePagination

Hook for pagination logic.

```javascript
import { usePagination } from '../hooks';

const {
  currentItems,
  currentPage,
  totalPages,
  goToNextPage,
  goToPrevPage,
  goToPage
} = usePagination(data, itemsPerPage);
```

**Parameters:**
- `data` (Array): Data to paginate
- `itemsPerPage` (number): Items per page

**Returns:**
- `currentItems` (Array): Current page items
- `currentPage` (number): Current page number
- `totalPages` (number): Total number of pages
- `goToNextPage` (function): Go to next page
- `goToPrevPage` (function): Go to previous page
- `goToPage` (function): Go to specific page

## 🛠️ Utility Functions

### Date Utilities

```javascript
import { formatDate } from '../utils';

const formattedDate = formatDate('2024-01-15');
// Returns: "1/15/2024"
```

### Performance Utilities

```javascript
import { debounce, throttle } from '../utils';

// Debounced function
const debouncedSearch = debounce(searchFunction, 300);

// Throttled function
const throttledScroll = throttle(scrollFunction, 100);
```

### Helper Functions

```javascript
import { isEmpty, deepClone, generateId } from '../utils';

// Check if value is empty
const isValueEmpty = isEmpty(value);

// Deep clone object
const clonedObject = deepClone(originalObject);

// Generate unique ID
const id = generateId('review');
```

## 📊 Data Models

### Rating Object

```typescript
interface Rating {
  ID: string;
  'Review Title': string;
  Rating: number;
  'Review Text': string;
  'Public Name': string;
  'Review Date': string;
  'Recommend Friend?': number;
  'Purchase Again?': number;
  'URL Params'?: string;
}
```

### Analytics Object

```typescript
interface Analytics {
  basic: {
    totalReviews: number;
    averageRating: number;
    medianRating: number;
    standardDeviation: number;
  };
  distribution: {
    counts: Record<number, number>;
    percentages: Record<number, number>;
    total: number;
  };
  recommendFriend: {
    totalResponses: number;
    recommendCount: number;
    recommendRate: number;
    byRating: Record<number, any>;
  };
  purchaseAgain: {
    totalResponses: number;
    purchaseAgainCount: number;
    purchaseAgainRate: number;
    byRating: Record<number, any>;
  };
  trends: {
    monthly: Array<any>;
    quarterly: Array<any>;
    yearly: Array<any>;
  };
}
```

## 🔧 Configuration

### Service Configuration

```javascript
import { getConfig } from '../config';

// Get configuration values
const apiTimeout = getConfig('api.timeout', 5000);
const cacheSize = getConfig('cache.maxSize', 100);
```

### Feature Flags

```javascript
import { getConfig } from '../config';

// Check feature flags
const analyticsEnabled = getConfig('features.analytics', false);
const cachingEnabled = getConfig('features.caching', true);
```

## 🚨 Error Handling

### Service Errors

```javascript
try {
  const ratings = await dataService.loadProductRatings();
} catch (error) {
  console.error('Failed to load ratings:', error.message);
}
```

### Hook Errors

```javascript
const { ratings, loading, error } = useReviews();

if (error) {
  return <div>Error: {error}</div>;
}
```

## 📈 Performance Considerations

### Caching

The services include built-in caching:

```javascript
// Clear cache
dataService.clearCache();
analyticsService.clearCache();
apiService.clearCache();

// Get cache stats
const stats = dataService.getCacheStats();
```

### Memory Management

```javascript
// Monitor memory usage
const cacheStats = dataService.getCacheStats();
console.log('Cache size:', cacheStats.cacheSize);
```

## 🔍 Debugging

### Service Debugging

```javascript
// Enable debug logging
console.log('Data service cache stats:', dataService.getCacheStats());
console.log('Analytics service cache stats:', analyticsService.getCacheStats());
```

### Performance Monitoring

```javascript
import { measureTime } from '../utils';

// Measure function execution time
const timedFunction = measureTime(myFunction, 'My Function');
const result = timedFunction();
```
