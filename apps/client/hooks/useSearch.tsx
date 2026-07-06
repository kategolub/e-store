import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';
import { getProducts } from '../services/public/products.service';
import { Product } from '../types/product';

export const useSearch = () => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedValue = useDebounce(value, 300);

  useEffect(() => {
    if (debouncedValue.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const data = await getProducts(1, 5, debouncedValue);
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
