import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));






export default defineConfig(({ mode }) => {
  process.env = {...process.env, ...loadEnv(mode, process.cwd())};
  // Load environment variables from .env.local file
  const certPath = process.env.VITE_SSL_CRT_FILE;
  const keyPath = process.env.VITE_SSL_KEY_FILE;
  const apiUrl =process.env.VITE_SERVER_URL; // Fallback to default
  return{
    plugins: [react()],
    server: {
      https:{
            key: fs.readFileSync(path.resolve(__dirname, keyPath)),
            cert: fs.readFileSync(path.resolve(__dirname, certPath)),
          },
      proxy: {
        '/api': {
          target: apiUrl, // Use environment variable for the backend URL
          changeOrigin: true,
          secure: false, // Set to false if using self-signed certificates
        },
      },
    },
  }
});