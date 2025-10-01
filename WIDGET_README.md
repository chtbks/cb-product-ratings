# Chatbooks Ratings Widget

A embeddable React widget for displaying product reviews and ratings.

## Features

- ⭐ **Star Ratings Display** - Shows aggregated ratings with partial stars
- 🔍 **Search & Filter** - Search reviews and filter by star rating
- ✅ **Verified Purchase Tags** - Shows verified purchase status
- 📊 **Distribution Tooltip** - Hover over stars to see rating distribution
- 📱 **Responsive Design** - Works on all device sizes
- 🎨 **Customizable** - Configurable appearance and behavior

## Quick Start

### 1. Build the Widget

```bash
npm install
npm run build:widget
```

This creates `dist/chatbooks-ratings-widget.js` - the embeddable widget file.

### 2. Host the Files

Upload the following files to your CDN or web server:
- `dist/chatbooks-ratings-widget.js` (the widget script)
- `public/product-ratings.csv` (your review data)

### 3. Embed on Your Website

Add this HTML to your website:

```html
<!-- Include React and ReactDOM -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Include the widget script -->
<script src="https://your-cdn.com/chatbooks-ratings-widget.js"></script>

<!-- Add container where widget will render -->
<div id="chatbooks-ratings-widget"></div>

<!-- Initialize the widget -->
<script>
window.ChatbooksRatings.init({
    containerId: 'chatbooks-ratings-widget',
    productId: 'your-product-id',
    maxReviews: 10
});
</script>
```

## Configuration Options

```javascript
window.ChatbooksRatings.init({
    // Required
    containerId: 'chatbooks-ratings-widget',  // ID of container element
    
    // Optional
    productId: 'default',                      // Product identifier
    theme: 'light',                           // 'light' or 'dark'
    showSearch: true,                         // Enable search functionality
    showFilters: true,                        // Enable rating filters
    maxReviews: 10,                          // Maximum reviews to display
    showVerifiedPurchase: true,              // Show verified purchase tags
    showDistributionTooltip: true,           // Show rating distribution on hover
    customStyles: {                          // Custom CSS styles
        maxWidth: '800px',
        margin: '0 auto'
    }
});
```

## API Reference

### `ChatbooksRatings.init(config)`
Initialize the widget with configuration options.

### `ChatbooksRatings.destroy(containerId)`
Remove the widget from the specified container.

### `ChatbooksRatings.isLoaded()`
Check if the widget library is loaded.

## Data Format

The widget expects a CSV file with the following columns:
- `ID` - Unique review identifier
- `Rating` - Star rating (1-5)
- `Review Title` - Title of the review
- `Review Content` - Main review text
- `Public Name` - Reviewer name
- `Review Date` - Date of the review
- `URL Params` - JSON string containing `order_id` for verified purchases

## Styling

The widget uses scoped CSS to prevent style conflicts. All styles are prefixed with `.chatbooks-ratings-widget`.

### Custom Styling

You can override styles by targeting the widget container:

```css
#chatbooks-ratings-widget {
    /* Your custom styles */
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
}
```

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

### Local Development
```bash
npm start
```

### Build Widget
```bash
npm run build:widget
```

### Test Widget
Open `example.html` in your browser to see the widget in action.

## Deployment Options

### Option 1: Static Hosting
- Upload `dist/chatbooks-ratings-widget.js` to CDN
- Upload `public/product-ratings.csv` to same domain
- Include script tags on target websites

### Option 2: Iframe Embedding
- Host the full React app
- Embed via iframe: `<iframe src="https://your-domain.com/widget"></iframe>`

### Option 3: NPM Package
- Publish as NPM package
- Install via `npm install chatbooks-ratings-widget`
- Import and use in React applications

## Troubleshooting

### Widget Not Loading
- Check browser console for errors
- Ensure React and ReactDOM are loaded before the widget
- Verify the container element exists

### Data Not Loading
- Check that `product-ratings.csv` is accessible
- Verify CORS settings if loading from different domain
- Check browser network tab for failed requests

### Styling Issues
- Ensure no conflicting CSS is overriding widget styles
- Check that the widget container has proper dimensions
- Verify responsive breakpoints work on your site

## Support

For issues or questions, please check the browser console for error messages and ensure all dependencies are properly loaded.
