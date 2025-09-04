import { useState, useEffect } from 'react';
import type { ProcessedShareholderData } from '../types';
import { fetchShareholderData } from '../api/dataService';

export const useShareholderData = () => {
  const [data, setData] = useState<ProcessedShareholderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const shareholderData = await fetchShareholderData();
        setData(shareholderData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
