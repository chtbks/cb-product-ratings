import { useMemo } from 'react';
import { analyticsService } from '../services';

export const useAnalytics = (ratings) => {
  return useMemo(() => {
    return analyticsService.calculateAnalytics(ratings);
  }, [ratings]);
};