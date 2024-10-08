import { Suspense } from 'react';

import { NotificationHub } from '@douglasneuroinformatics/libui/components';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';

import { LoadingFallback } from './components';
import { ErrorPage } from './components/ErrorPage.js';
import { SetupProvider } from './features/setup';
import { Router } from './Router.js';
import { queryClient } from './services/react-query.js';

import './services/axios';
import './services/i18n';

export const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <QueryClientProvider client={queryClient}>
          <NotificationHub />
          <SetupProvider>
            <Router />
          </SetupProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </ErrorBoundary>
    </Suspense>
  );
};
