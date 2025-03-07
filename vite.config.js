import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
           target: 'http://127.0.0.1:5001',
           changeOrigin: true,
           secure: false,
       } // Proxy requests to backend
    }
  },
  plugins: [react()],
})
