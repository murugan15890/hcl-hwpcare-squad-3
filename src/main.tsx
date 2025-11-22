import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ReduxProvider } from './app/providers/ReduxProvider';
import { AppRouter } from './app/routes';
import './styles/globals.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ReduxProvider>
      <AppRouter />
    </ReduxProvider>
  </StrictMode>
);


