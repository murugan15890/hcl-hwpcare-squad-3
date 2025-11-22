
import { createRoot } from 'react-dom/client';
import { ReduxProvider } from './app/providers/ReduxProvider';
import { AppRouter } from './app/routes';
import './styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(

    <QueryClientProvider client={queryClient}>
    <ReduxProvider>
      <AppRouter />
    </ReduxProvider>
    </QueryClientProvider>
);


