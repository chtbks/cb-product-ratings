# CB Product Ratings Widget

A high-performance React application for displaying customer product reviews with advanced filtering, analytics, and pagination.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker (optional)

### Development
```bash
npm install
npm start
```

### Docker
```bash
docker build -t cb-product-ratings .
docker run -p 3000:3000 cb-product-ratings
```

## 📁 Project Structure

```
src/
├── components/           # React components
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── App.js              # Main application
└── App.css             # Global styles
```

## 🎯 Key Features

- **CSV Data Loading**: Parses product ratings from CSV file
- **Search & Filter**: Real-time search with rating filters
- **Pagination**: Efficient pagination for large datasets
- **Analytics**: Review statistics and insights
- **Performance Optimized**: Lazy loading, memoization, code splitting

## 🛠 Development

### Quick Commands
```bash
npm start          # Development server
npm run build      # Production build
npm run lint       # Code linting
```

### Key Dependencies
- **React 18**: Modern React features
- **PapaParse**: CSV parsing
- **PropTypes**: Type checking

## 📚 Documentation

All documentation is located in the `docs/` directory:

### Essential Documentation
- **[DEVELOPER_HANDOVER.md](docs/DEVELOPER_HANDOVER.md)**: Complete developer handover guide
- **[INTEGRATION_GUIDE.md](docs/INTEGRATION_GUIDE.md)**: Step-by-step integration instructions
- **[WEBPAGE_INTEGRATION.md](docs/WEBPAGE_INTEGRATION.md)**: Integration into larger web applications
- **[API_INTEGRATION.md](docs/API_INTEGRATION.md)**: Backend API integration and data sources

### Additional Resources
- **[data/README.md](data/README.md)**: Data files documentation
- **[scripts/README.md](scripts/README.md)**: Scripts documentation
- **[tests/README.md](tests/README.md)**: Testing documentation

## 🎨 Features

### Performance Optimizations
- **React.memo**: Prevents unnecessary re-renders
- **useMemo/useCallback**: Memoizes expensive calculations
- **Lazy Loading**: Code splitting for better performance
- **Debouncing**: Reduces search processing
- **Tree Shaking**: Removes unused code

### Component Architecture
- **App.js**: Main container with state management and performance monitoring
- **ReviewCard.js**: Individual review display with star ratings and verified purchase tags
- **SearchFilter.js**: Search input with debouncing and rating dropdown filter
- **AnalyticsSection.js**: Review statistics with lazy loading
- **Pagination.js**: Page navigation controls

### Custom Hooks
- **useReviews.js**: CSV data loading, validation, and performance monitoring
- **usePagination.js**: Pagination state and navigation logic
- **useAnalytics.js**: Statistics calculation and data aggregation

---

**Built with React 18, optimized for performance, and designed for maintainability.**