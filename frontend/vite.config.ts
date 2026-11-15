import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Dev only: forward API calls to the backend so the app and API share an
    // origin, exactly as in the single production deployment.
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
})
