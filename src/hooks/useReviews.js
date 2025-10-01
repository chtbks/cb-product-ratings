import { useState, useEffect } from 'react';
import Papa from 'papaparse';

export const useReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Papa.parse('/product-ratings.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const data = results.data.filter(row => row.ID && row.Rating);
        setRatings(data);
        setLoading(false);
      },
      error: (error) => {
        setError('Failed to load review data. Please try again later.');
        setLoading(false);
      }
    });
  }, []);

  return { ratings, loading, error };
};
