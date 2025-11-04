import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: path.resolve(__dirname, 'src/infrastructure/ui'),
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  server: {
    port: 8080,
    proxy: {
      '/_trpc': 'http://localhost:9000',
    },
  },
  plugins: [react()],
});
