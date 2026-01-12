import { defineConfig } from 'vite'
import reactPlugin from '@vitejs/plugin-react'
import tailwindPlugin from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactPlugin(), tailwindPlugin()],
  build: {
    sourcemap: false,
    target: 'esnext',
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
          charts: ['recharts'],
        },
      },
    },
  }
})
