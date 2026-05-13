import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { apiFetch } from '../lib/api';
import { Product, ProductsResponse } from '../types/product';

export const useSearch = () => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<ProductsResponse>(`/products?search=${debouncedValue}&limit=5`);
        setResults(data.products || []);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedValue]);


  return { value, setValue, results, isLoading };
};

