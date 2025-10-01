# Classic Book Reviews

A React application for displaying book reviews from CSV data with a clean, modern interface.

## Features

- 📚 Display book reviews in an attractive card layout
- ⭐ Visual star ratings (1-5 stars)
- 📱 Responsive design for mobile and desktop
- 🔄 Load more reviews functionality
- 📊 CSV data loading with Papa Parse
- 🐳 Docker development environment

## Quick Start with Docker

### Prerequisites
- Docker and Docker Compose installed on your system

### Running the Application

1. **Build and start the development environment:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   Open your browser and navigate to `http://localhost:3000`

3. **Development workflow:**
   - The app will automatically reload when you make changes to the source code
   - The container includes hot reloading for a smooth development experience

### Stopping the Application

```bash
docker-compose down
```

## Local Development (without Docker)

If you prefer to run the application locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Access the application:**
   Open `http://localhost:3000` in your browser

## Project Structure

```
src/
├── components/
│   ├── ReviewCard.js          # Individual review card component
│   ├── ReviewCard.css         # Card styling
│   ├── StarRating.js          # Star rating display component
│   └── StarRating.css         # Star rating styling
├── App.js                     # Main application component
├── App.css                    # Main application styling
├── index.js                   # Application entry point
└── index.css                  # Global styles

public/
└── sample-reviews.csv         # Sample CSV data
```

## CSV Data Format

The application expects CSV files with the following columns:
- `id`: Unique identifier
- `book`: Book title
- `title`: Review title
- `text`: Review content
- `rating`: Star rating (1-5)
- `reviewer`: Reviewer name
- `date`: Review date (YYYY-MM-DD format)

## Customization

### Adding Your Own CSV Data

1. Replace `public/sample-reviews.csv` with your own CSV file
2. Ensure the CSV follows the expected format
3. The application will automatically load your data

### Styling

- Modify CSS files in the `src/` directory to customize the appearance
- The design uses a clean, modern aesthetic with responsive grid layout
- Color scheme can be adjusted in the CSS files

## Technologies Used

- **React 18** - Frontend framework
- **Papa Parse** - CSV parsing library
- **Docker** - Containerization
- **CSS Grid** - Responsive layout
- **Modern CSS** - Clean styling with gradients and animations

## Development Notes

- The application includes fallback sample data if CSV loading fails
- Hot reloading is enabled for smooth development
- The Docker setup includes volume mounting for live code updates
- Responsive design works on mobile, tablet, and desktop devices
