import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5196,
    strictPort: true,
    fs: {
      allow: ['..']
    },
    proxy: {
      '/api': 'http://127.0.0.1:5195',
      '/uploads': 'http://127.0.0.1:5195'
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      // Single source of truth: public/manifest.json (linked cleanly from index.html)
      manifest: false
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/recharts/')) {
            return 'vendor-charts';
          }
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase';
          }
          if (id.includes('node_modules/motion/') || id.includes('node_modules/framer-motion/')) {
            return 'vendor-motion';
          }
        }
      }
    }
  }
});
