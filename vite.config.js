import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: true,
    proxy: {
      // Proxy requests from /api to the backend server
      '/api': {
        target: 'https://weather-backend-ogz2.onrender.com',
        changeOrigin: true,
        secure: false, // IMPORTANT: This allows connecting to a backend with a self-signed certificate
        rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api from the request path
      },
    },
  },
});
