import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

// Load environment variables from .env file
const isHttps = process.env.VITE_HTTPS === 'true';
const certPath = process.env.VITE_SSL_CRT_FILE;
const keyPath = process.env.VITE_SSL_KEY_FILE;
const apiUrl = process.env.VITE_SERVER_URL // Fallback to default

export default defineConfig({
  server: {
    https: isHttps
      ? {
          key: fs.readFileSync(path.resolve(__dirname, keyPath)),
          cert: fs.readFileSync(path.resolve(__dirname, certPath)),
        }
      : false,
    proxy: {
      '/api': {
        target: apiUrl, // Use environment variable for the backend URL
        changeOrigin: true,
        secure: false, // Set to false if using self-signed certificates
      },
    },
  },
  plugins: [react()],
});