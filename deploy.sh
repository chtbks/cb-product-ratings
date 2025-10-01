#!/bin/bash

# Chatbooks Ratings Widget Deployment Script
echo "🚀 Chatbooks Ratings Widget Deployment"
echo "======================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Build the widget
echo "📦 Building widget..."
npm run build:widget

if [ $? -ne 0 ]; then
    echo "❌ Widget build failed"
    exit 1
fi

echo "✅ Widget built successfully"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found"
    exit 1
fi

# Check if widget file exists
if [ ! -f "dist/chatbooks-ratings-widget.js" ]; then
    echo "❌ Error: Widget file not found"
    exit 1
fi

echo "✅ Widget file ready: dist/chatbooks-ratings-widget.js"

# Check if CSV data exists
if [ ! -f "public/product-ratings.csv" ]; then
    echo "❌ Error: CSV data file not found"
    exit 1
fi

echo "✅ Data file ready: public/product-ratings.csv"

# Show file sizes
echo ""
echo "📊 File Information:"
echo "Widget size: $(du -h dist/chatbooks-ratings-widget.js | cut -f1)"
echo "Data size: $(du -h public/product-ratings.csv | cut -f1)"

echo ""
echo "🎯 Next Steps:"
echo "1. Upload these files to your CDN/hosting:"
echo "   - dist/chatbooks-ratings-widget.js"
echo "   - public/product-ratings.csv"
echo ""
echo "2. Update the script URLs in your websites:"
echo "   <script src=\"https://your-cdn.com/chatbooks-ratings-widget.js\"></script>"
echo ""
echo "3. Test the widget:"
echo "   - Open example.html in your browser"
echo "   - Check browser console for errors"
echo "   - Test search and filter functionality"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
echo "✅ Ready for deployment!"
