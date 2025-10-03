# CB Product Ratings Widget

A modern, production-ready React application for displaying product ratings and reviews with advanced analytics and filtering capabilities.

## 🚀 Features

- **📊 Advanced Analytics**: Comprehensive rating distribution, recommendation rates, and purchase intent analytics
- **🔍 Smart Filtering**: Real-time search and rating-based filtering
- **⭐ Interactive Ratings**: Visual star ratings with hover tooltips and distribution charts
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **⚡ Performance Optimized**: Service layer caching, lazy loading, and efficient data management
- **🎨 Modern UI**: Clean, professional interface with custom fonts and animations
- **🔧 Developer Friendly**: Well-organized codebase following React best practices

## 🏗️ Architecture

This application follows a modern, scalable architecture:

- **Service Layer**: Centralized data management with caching and error handling
- **Component-Based**: Feature-based organization with reusable UI components
- **Custom Hooks**: Encapsulated business logic and state management
- **Utility Functions**: Comprehensive helper functions and performance optimizations
- **Asset Organization**: Properly structured fonts, images, and data files

## 📋 Prerequisites

- Node.js 16+ or Docker
- Modern web browser
- Git

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd cb-product-ratings

# Start the application
docker compose up --build

# Access the application
open http://localhost:3000
```

### Option 2: Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Access the application
open http://localhost:3000
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── services/           # Service layer
│   ├── api/           # API services
│   └── data/          # Data services
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── assets/            # Static assets
└── config/           # Application configuration
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run ESLint

### Docker Development

```bash
# Start development environment
./scripts/development/docker-dev.sh

# Or manually
docker compose up --build
```

## 🚀 Deployment

### Production Build

```bash
# Build the application
npm run build

# The build files will be in the 'build' directory
```

### Docker Production

```bash
# Build production image
docker build -t cb-product-ratings .

# Run production container
docker run -p 3000:3000 cb-product-ratings
```

### Deployment Script

```bash
# Use the deployment script
./deploy.sh
```

## 📊 Data Format

The application expects CSV data with the following columns:

- `ID` - Unique identifier
- `Review Title` - Review title
- `Rating` - Rating (1-5)
- `Review Text` - Review content
- `Public Name` - Reviewer name
- `Review Date` - Review date
- `Recommend Friend?` - Recommendation score (1-5)
- `Purchase Again?` - Purchase intent score (1-5)
- `URL Params` - Additional metadata (JSON)

## 🔧 Configuration

Environment variables can be configured in `.env`:

```env
REACT_APP_API_BASE_URL=your-api-url
REACT_APP_FEATURE_ANALYTICS=true
REACT_APP_FEATURE_CACHING=true
```

## 📚 Documentation

- [Project Structure](PROJECT_STRUCTURE.md) - Detailed architecture documentation
- [API Documentation](docs/api/) - API integration guide
- [Component Documentation](docs/components/) - Component usage guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.