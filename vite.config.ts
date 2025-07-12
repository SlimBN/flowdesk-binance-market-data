import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { BUILD_CONFIG } from './src/constants/config'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: BUILD_CONFIG.CHUNK_SIZE_WARNING_LIMIT,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          i18n: ['react-i18next', 'i18next', 'i18next-browser-languagedetector', 'i18next-http-backend'],
        },
      },
    },
  },
})
