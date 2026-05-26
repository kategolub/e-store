'use client';

import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { store } from '../lib/store';
import { queryClient } from '../lib/query/queryClient';
import AuthInitializer from '../components/auth/AuthInitializer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
