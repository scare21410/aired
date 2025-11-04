import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import rpcClientFactory from '../rpc-client/rpc-client-factory.js';
import routerFactory from './router-factory.js';
import '@aired/ui/styles.css';

const { trpc, trpcClient } = rpcClientFactory();
const queryClient = new QueryClient();
const router = createBrowserRouter([routerFactory()]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <RouterProvider router={router} />
    </trpc.Provider>
  </StrictMode>,
);
