
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, HashRouter } from 'react-router-dom';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure you have an element with id 'root' in your HTML file.");
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Choose router based on whether we're embedded in a Shopify theme.
const runningInsideShopify = (window as any).__SHOPIFY__ && (window as any).__SHOPIFY__.theme_id;
const Router = runningInsideShopify ? HashRouter : BrowserRouter;

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <App />
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  </StrictMode>
);
