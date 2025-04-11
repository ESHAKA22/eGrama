import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        console.log('Request URL:', req.url);
        next();
      });
    },
  },
});