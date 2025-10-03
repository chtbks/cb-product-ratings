# Component Documentation

This document provides comprehensive documentation for all components in the CB Product Ratings Widget.

## 🧩 Component Architecture

The application follows a feature-based component architecture:

```
src/components/
├── ui/                    # Reusable UI components
│   ├── StarRating/       # Star rating display
│   └── Pagination/       # Pagination controls
└── features/             # Feature-specific components
    ├── reviews/          # Review-related components
    └── analytics/        # Analytics components
```

## 🎨 UI Components

### StarRating

A reusable star rating component with support for partial ratings and different sizes.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `rating` | number | required | Rating value (1-5) |
| `size` | string | 'default' | Size variant ('small', 'default', 'large') |

#### Usage

```jsx
import { StarRating } from '../ui';

<StarRating rating={4.5} size="large" />
```

#### Features

- Partial star support (e.g., 4.5 stars)
- Multiple size variants
- Accessible with ARIA labels
- Smooth animations

### Pagination

A flexible pagination component with customizable controls.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | number | required | Current page number |
| `totalPages` | number | required | Total number of pages |
| `onPageChange` | function | required | Page change handler |
| `maxVisiblePages` | number | 5 | Maximum visible page numbers |

#### Usage

```jsx
import { Pagination } from '../ui';

<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={handlePageChange}
  maxVisiblePages={7}
/>
```

#### Features

- Responsive design
- Keyboard navigation
- Ellipsis for large page counts
- Customizable styling

## 📊 Feature Components

### Reviews Feature

#### ReviewCard

Displays individual review information in a card format.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `review` | object | required | Review data object |

#### Usage

```jsx
import { ReviewCard } from '../features/reviews';

<ReviewCard review={reviewData} />
```

#### Features

- Star rating display
- Verified purchase indicator
- Formatted date display
- Responsive layout

#### SearchFilter

Provides search and filtering functionality.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | '' | Current search term |
| `ratingFilter` | string | 'all' | Current rating filter |
| `onSearchChange` | function | required | Search change handler |
| `onRatingChange` | function | required | Rating filter change handler |

#### Usage

```jsx
import { SearchFilter } from '../features/reviews';

<SearchFilter
  searchTerm={searchTerm}
  ratingFilter={ratingFilter}
  onSearchChange={setSearchTerm}
  onRatingChange={setRatingFilter}
/>
```

#### Features

- Real-time search
- Rating-based filtering
- Debounced input
- Accessible controls

#### ReviewsPage

Main page component that orchestrates all review functionality.

#### Props

None (uses internal state and hooks)

#### Usage

```jsx
import { ReviewsPage } from '../features/reviews';

<ReviewsPage />
```

#### Features

- Data loading and management
- Search and filtering
- Pagination
- Analytics integration
- Error handling

### Analytics Feature

#### AnalyticsSection

Displays comprehensive analytics and statistics.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `stats` | object | required | Analytics data |
| `showDistributionTooltip` | boolean | false | Show rating distribution tooltip |
| `onMouseEnter` | function | optional | Mouse enter handler |
| `onMouseLeave` | function | optional | Mouse leave handler |

#### Usage

```jsx
import { AnalyticsSection } from '../features/analytics';

<AnalyticsSection
  stats={analyticsData}
  showDistributionTooltip={showTooltip}
  onMouseEnter={handleMouseEnter}
  onMouseLeave={handleMouseLeave}
/>
```

#### Features

- Average rating display
- Rating distribution chart
- Recommendation statistics
- Purchase intent analytics
- Interactive tooltips

## 🎣 Custom Hooks

### useReviews

Manages review data loading and state.

#### Returns

| Property | Type | Description |
|---------|------|-------------|
| `ratings` | Array | Array of review objects |
| `loading` | boolean | Loading state |
| `error` | string\|null | Error message |

#### Usage

```jsx
import { useReviews } from '../hooks';

const { ratings, loading, error } = useReviews();
```

### useAnalytics

Calculates analytics from review data.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `ratings` | Array | Array of review objects |

#### Returns

| Property | Type | Description |
|---------|------|-------------|
| `analytics` | Object | Comprehensive analytics data |

#### Usage

```jsx
import { useAnalytics } from '../hooks';

const analytics = useAnalytics(ratings);
```

### usePagination

Manages pagination logic and state.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Array | Data to paginate |
| `itemsPerPage` | number | Items per page |

#### Returns

| Property | Type | Description |
|---------|------|-------------|
| `currentItems` | Array | Current page items |
| `currentPage` | number | Current page number |
| `totalPages` | number | Total number of pages |
| `goToNextPage` | function | Go to next page |
| `goToPrevPage` | function | Go to previous page |
| `goToPage` | function | Go to specific page |

#### Usage

```jsx
import { usePagination } from '../hooks';

const {
  currentItems,
  currentPage,
  totalPages,
  goToNextPage,
  goToPrevPage,
  goToPage
} = usePagination(data, 10);
```

## 🎨 Styling

### Component-Specific CSS

Each component has its own CSS file:

- `StarRating.css` - Star rating styles
- `Pagination.css` - Pagination styles
- `ReviewCard.css` - Review card styles
- `SearchFilter.css` - Search filter styles
- `AnalyticsSection.css` - Analytics styles

### CSS Classes

#### StarRating Classes

```css
.star-rating          /* Container */
.star                 /* Individual star */
.star.filled          /* Filled star */
.star.partial         /* Partial star */
.star.empty           /* Empty star */
.star.small           /* Small size */
.star.large           /* Large size */
```

#### Pagination Classes

```css
.custom-pagination           /* Container */
.custom-pagination-nav       /* Navigation container */
.custom-pagination-pages     /* Page numbers container */
.custom-pagination-button    /* Page button */
.custom-pagination-button.active  /* Active page */
.custom-pagination-button.ellipsis /* Ellipsis */
```

#### ReviewCard Classes

```css
.custom-review                    /* Review container */
.custom-review-center-panel       /* Main content */
.custom-review-rating-title      /* Rating and title */
.custom-reviewer                 /* Reviewer info */
.custom-review-content           /* Review text */
.custom-review-right-panel       /* Side panel */
```

## 🔧 Configuration

### Component Configuration

Components can be configured through props and context:

```jsx
// Theme configuration
const theme = {
  colors: {
    primary: '#24B69A',
    secondary: '#52DBC1'
  },
  spacing: {
    small: '8px',
    medium: '16px',
    large: '24px'
  }
};

// Component with theme
<StarRating rating={4.5} theme={theme} />
```

### Responsive Configuration

Components automatically adapt to different screen sizes:

```css
/* Mobile styles */
@media (max-width: 768px) {
  .custom-review {
    flex-direction: column;
  }
}

/* Tablet styles */
@media (max-width: 992px) {
  .custom-analytics-section-container {
    flex-direction: column;
  }
}
```

## 🧪 Testing

### Component Testing

```jsx
import { render, screen } from '@testing-library/react';
import { StarRating } from '../ui';

test('renders star rating', () => {
  render(<StarRating rating={4.5} />);
  expect(screen.getByText('4.5')).toBeInTheDocument();
});
```

### Hook Testing

```jsx
import { renderHook } from '@testing-library/react-hooks';
import { useReviews } from '../hooks';

test('loads reviews data', async () => {
  const { result } = renderHook(() => useReviews());
  
  expect(result.current.loading).toBe(true);
  
  await waitFor(() => {
    expect(result.current.loading).toBe(false);
    expect(result.current.ratings).toHaveLength(10);
  });
});
```

## 🚀 Performance

### Optimization Techniques

- **Memoization**: Components use `React.memo` for performance
- **Lazy Loading**: Large components are lazy-loaded
- **Debouncing**: Search inputs are debounced
- **Caching**: Service layer includes caching

### Best Practices

1. **Use React.memo** for expensive components
2. **Implement shouldComponentUpdate** for complex components
3. **Use useMemo** for expensive calculations
4. **Use useCallback** for event handlers
5. **Lazy load** large components

## 🔍 Debugging

### Component Debugging

```jsx
// Add debug props
<StarRating 
  rating={4.5} 
  debug={true}
  onDebug={(data) => console.log('StarRating debug:', data)}
/>
```

### Performance Debugging

```jsx
import { measureTime } from '../utils';

// Measure component render time
const TimedComponent = measureTime(MyComponent, 'MyComponent');
```

## 📚 Examples

### Complete Review Page

```jsx
import React, { useState } from 'react';
import { ReviewsPage } from '../features/reviews';
import { AnalyticsSection } from '../features/analytics';

function App() {
  return (
    <div className="app">
      <ReviewsPage />
    </div>
  );
}
```

### Custom Star Rating

```jsx
import { StarRating } from '../ui';

function CustomRating({ rating, onRatingChange }) {
  return (
    <div className="custom-rating-container">
      <StarRating rating={rating} size="large" />
      <span className="rating-text">{rating} out of 5</span>
    </div>
  );
}
```

### Custom Pagination

```jsx
import { Pagination } from '../ui';

function CustomPagination({ data, itemsPerPage }) {
  const [currentPage, setCurrentPage] = useState(1);
  
  const totalPages = Math.ceil(data.length / itemsPerPage);
  
  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
      maxVisiblePages={7}
    />
  );
}
```
