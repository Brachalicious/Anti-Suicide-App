import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: 'client',
  // Default publicDir is `<root>/public`. Use a symlink `client/public` → `../public`
  // so dev server's public allowlist matches paths like `/logo.svg` (publicDir outside root breaks this on some setups).
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        // If you run the backend on a non-3000 port, set one of:
        // - VITE_API_PROXY_TARGET="http://localhost:<BACKEND_PORT>"
        // - VITE_API_PROXY_PORT="<BACKEND_PORT>"
        target:
          process.env.VITE_API_PROXY_TARGET ??
          `http://localhost:${process.env.VITE_API_PROXY_PORT ?? "3000"}`,
        changeOrigin: true,
      },
    },
  },
});
