import { useState, useEffect } from 'react';
import { dataService } from '../services';

export const useReviews = () => {
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRatings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await dataService.loadProductRatings();
        setRatings(data);
      } catch (err) {
        console.error('Error loading ratings:', err);
        setError('Failed to load review data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadRatings();
  }, []);

  return { ratings, loading, error };
};
