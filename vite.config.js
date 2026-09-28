import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['react', 'react-dom/client', 'lucide-react', 'react/jsx-dev-runtime'],
  },
  server: {
    port: 5173,
    watch: {
      ignored: ['**/*.mp4', '**/*.webm', '**/*.mkv', '**/.git/**', '**/scratch/**'],
    },
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})
