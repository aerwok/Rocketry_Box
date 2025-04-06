import './index.css'
import App from './App.tsx'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MockApiProvider from './providers/mock-api-provider';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: false,
        },
    },
});

// This will be configured via env variables when backend is ready
const useMockApiByDefault = import.meta.env.VITE_USE_MOCK_API !== 'false';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MockApiProvider initialValue={useMockApiByDefault}>
        <App />
      </MockApiProvider>
    </QueryClientProvider>
  </StrictMode>,
)
