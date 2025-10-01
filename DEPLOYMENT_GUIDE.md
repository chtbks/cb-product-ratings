# Chatbooks Ratings Widget - Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Static File Hosting (Recommended)

**Best for:** Simple deployment, no server setup required

#### Step 1: Prepare Files
```bash
# Build the widget
npm run build:widget

# Your files are ready:
# - dist/chatbooks-ratings-widget.js (45KB)
# - public/product-ratings.csv (your data)
```

#### Step 2: Upload to CDN/Hosting
Upload these files to your hosting service:

**Files to upload:**
- `dist/chatbooks-ratings-widget.js` → `https://your-cdn.com/widgets/chatbooks-ratings-widget.js`
- `public/product-ratings.csv` → `https://your-cdn.com/data/product-ratings.csv`

**Recommended CDN Services:**
- **AWS S3 + CloudFront** (most reliable)
- **Netlify** (free tier available)
- **Vercel** (free tier available)
- **GitHub Pages** (free)
- **Cloudflare** (free tier available)

#### Step 3: Embed on Websites
Add this code to any website:

```html
<!-- Include React and ReactDOM -->
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>

<!-- Include your widget -->
<script src="https://your-cdn.com/widgets/chatbooks-ratings-widget.js"></script>

<!-- Add container -->
<div id="chatbooks-ratings-widget"></div>

<!-- Initialize widget -->
<script>
window.ChatbooksRatings.init({
    containerId: 'chatbooks-ratings-widget',
    productId: 'your-product-id',
    maxReviews: 10
});
</script>
```

---

### Option 2: Docker Deployment

**Best for:** Full control, existing Docker infrastructure

#### Step 1: Build Docker Image
```bash
docker build -t chatbooks-widget .
```

#### Step 2: Run Container
```bash
# Run the full app (includes widget)
docker run -d --name chatbooks-widget -p 3000:3000 chatbooks-widget

# Access at: http://localhost:3000
```

#### Step 3: Use Iframe Embedding
```html
<iframe 
    src="http://your-domain.com:3000" 
    width="100%" 
    height="600px"
    frameborder="0">
</iframe>
```

---

### Option 3: NPM Package Distribution

**Best for:** React applications, developers

#### Step 1: Publish to NPM
```bash
# Update package.json
npm version patch
npm publish

# Install on target sites
npm install chatbooks-ratings-widget
```

#### Step 2: Use in React Apps
```javascript
import ChatbooksRatingsWidget from 'chatbooks-ratings-widget';

function ProductPage() {
    return (
        <div>
            <h1>Product Reviews</h1>
            <ChatbooksRatingsWidget 
                config={{
                    productId: 'product-123',
                    maxReviews: 5
                }}
            />
        </div>
    );
}
```

---

## 🔧 Configuration Options

### Widget Configuration
```javascript
window.ChatbooksRatings.init({
    // Required
    containerId: 'chatbooks-ratings-widget',
    
    // Optional
    productId: 'default',                    // Product identifier
    theme: 'light',                          // 'light' or 'dark'
    showSearch: true,                        // Enable search
    showFilters: true,                       // Enable rating filters
    maxReviews: 10,                          // Max reviews to show
    showVerifiedPurchase: true,              // Show verified tags
    showDistributionTooltip: true,           // Show rating distribution
    customStyles: {                          // Custom CSS
        maxWidth: '800px',
        margin: '0 auto',
        border: '1px solid #ddd'
    }
});
```

### Data Configuration
Update `public/product-ratings.csv` with your review data:

**Required columns:**
- `ID` - Unique review identifier
- `Rating` - Star rating (1-5)
- `Review Title` - Title of the review
- `Review Content` - Main review text
- `Public Name` - Reviewer name
- `Review Date` - Date of the review
- `URL Params` - JSON string with `order_id` for verified purchases

---

## 🌐 Hosting Services Setup

### AWS S3 + CloudFront
```bash
# Upload files to S3
aws s3 cp dist/chatbooks-ratings-widget.js s3://your-bucket/widgets/
aws s3 cp public/product-ratings.csv s3://your-bucket/data/

# Set up CloudFront distribution
# Point to: https://d1234567890.cloudfront.net/widgets/chatbooks-ratings-widget.js
```

### Netlify
```bash
# Create netlify.toml
[build]
  publish = "dist"
  
[[headers]]
  for = "/*.js"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Cache-Control = "public, max-age=31536000"

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Create vercel.json
{
  "public": true,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}

# Deploy
vercel --prod
```

---

## 🧪 Testing Your Deployment

### Local Testing
```bash
# Start test server
python3 -m http.server 8081

# Open in browser
open http://localhost:8081/example.html
```

### Production Testing
1. **Check widget loads:** Open browser console, look for errors
2. **Test functionality:** Search, filter, hover over stars
3. **Test responsiveness:** Try different screen sizes
4. **Test data loading:** Verify CSV data loads correctly

### Common Issues & Solutions

**Widget not loading:**
- Check React/ReactDOM are loaded first
- Verify script URL is accessible
- Check browser console for errors

**Data not loading:**
- Verify CSV file is accessible
- Check CORS settings
- Ensure file path is correct

**Styling issues:**
- Check for CSS conflicts
- Verify container has proper dimensions
- Test responsive breakpoints

---

## 📊 Performance Optimization

### CDN Configuration
```javascript
// Set proper cache headers
Cache-Control: public, max-age=31536000  // 1 year for widget
Cache-Control: public, max-age=3600     // 1 hour for data
```

### Widget Optimization
- Widget bundle: 45KB (minified)
- Load time: ~200ms on fast connection
- Memory usage: ~2MB
- Compatible with: React 18+, modern browsers

---

## 🔒 Security Considerations

### CORS Configuration
```javascript
// Allow cross-origin requests
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

### Content Security Policy
```html
<!-- Add to your website's CSP -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' 'unsafe-inline' https://unpkg.com https://your-cdn.com;">
```

---

## 📈 Analytics & Monitoring

### Track Widget Usage
```javascript
// Add analytics to widget initialization
window.ChatbooksRatings.init({
    // ... config
    onLoad: () => {
        // Track widget load
        gtag('event', 'widget_loaded', {
            'event_category': 'engagement',
            'event_label': 'chatbooks_ratings'
        });
    }
});
```

### Monitor Performance
- Use browser dev tools to check load times
- Monitor error rates in console
- Track user interactions with widget

---

## 🚀 Production Checklist

- [ ] Widget builds successfully (`npm run build:widget`)
- [ ] Files uploaded to CDN/hosting
- [ ] CORS headers configured
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] Performance optimized
- [ ] Analytics tracking added
- [ ] Error monitoring set up
- [ ] Documentation updated
- [ ] Integration examples provided

---

## 🔄 API Migration

**Planning to move from CSV to API?** See our comprehensive migration guide:

📖 **[API_MIGRATION_GUIDE.md](./API_MIGRATION_GUIDE.md)** - Complete guide for transitioning to API endpoints

**Quick API Setup:**
```javascript
// Future API configuration
window.ChatbooksRatings.init({
    containerId: 'chatbooks-ratings-widget',
    productId: 'your-product-id',
    apiBaseUrl: 'https://api.yourcompany.com',
    apiEndpoint: '/reviews',
    fallbackToCsv: true  // Graceful fallback during transition
});
```

## 📞 Support

For deployment issues:
1. Check browser console for errors
2. Verify file accessibility
3. Test with example.html locally
4. Review WIDGET_README.md for detailed docs
5. Check API_MIGRATION_GUIDE.md for API transition

**Ready to deploy!** 🎉
