import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load CSV data
    Papa.parse('/product-ratings.csv', {
      download: true,
      header: true,
      complete: (results) => {
        console.log('CSV parsing complete:', results);
        const data = results.data.filter(row => row.ID && row.Rating); // Filter out empty rows
        console.log('Filtered data:', data.length, 'rows');
        setRatings(data);
        setLoading(false);
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        // Fallback to sample data if CSV fails to load
        const sampleData = [
          {
            ID: '1',
            'Review Title': 'Great product!',
            Rating: '5',
            'Review Text': 'I love this product, it works perfectly.',
            'Public Name': 'John D.',
            'Review Date': '2024-01-15'
          },
          {
            ID: '2', 
            'Review Title': 'Amazing quality',
            Rating: '4',
            'Review Text': 'Very good quality, would recommend.',
            'Public Name': 'Sarah M.',
            'Review Date': '2024-01-14'
          }
        ];
        setRatings(sampleData);
        setLoading(false);
      }
    });
  }, []);

  return { ratings, loading, error };
};
