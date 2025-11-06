import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@aired/ui';
import rpcClientFactory from '../rpc-client/rpc-client-factory.js';
import routerFactory from './router-factory.js';
import './styles.css';

const { trpc, trpcClient } = rpcClientFactory();
const queryClient = new QueryClient();
const router = createBrowserRouter([routerFactory()]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="project-ui-theme">
      <trpc.Provider queryClient={queryClient} client={trpcClient}>
        <RouterProvider router={router} />
      </trpc.Provider>
    </ThemeProvider>
  </StrictMode>,
);
