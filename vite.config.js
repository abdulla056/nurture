import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/members': 'http://127.0.0.1:5001', // Proxy requests to backend
    }
  },
  plugins: [react()],
})
