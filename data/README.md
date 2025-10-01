# Data Directory

This directory contains all data files for the CB Product Ratings project.

## 📁 Contents

### CSV Data Files
- **`product-ratings.csv`**: Main product ratings data file
  - Contains review data with ratings, titles, text, names, dates
  - Includes URL parameters for verified purchase tracking
  - Used by the application for displaying reviews

## 🔄 Data Flow

1. **Source**: `data/product-ratings.csv` (master data file)
2. **Application**: `public/product-ratings.csv` (served by web server)
3. **Processing**: Parsed by PapaParse in `useReviews.js` hook

## 📝 Notes

- The CSV file is copied to `public/` directory for web access
- Data structure is documented in component documentation
- Future API migration will replace CSV loading
