import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/generate': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/save': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/trips': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/export-pdf': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
      '/health': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    }
  }
})
