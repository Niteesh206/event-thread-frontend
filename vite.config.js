// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'https://event-thread-backend.onrender.com/',
//         changeOrigin: true,
//       }
//     }
//   }
// })

// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Allow overriding the backend target during dev. Default to hosted backend so
// the app works without running the API locally.
const backend = process.env.VITE_API_URL || 'https://event-thread-backend.onrender.com';

export default defineConfig({
  plugins: [react()],
  base: '/', // Ensure proper base path for Vercel
  publicDir: 'public', // Explicitly set public directory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    copyPublicDir: true // Ensure public folder files are copied to dist
  },
  server: {
    host: true,
    port: 5173,
    hmr: {
      host: 'localhost',
      protocol: 'ws',
      port: 5173
    },
    proxy: {
      '/api': {
        target: backend,
        changeOrigin: true,
        secure: backend.startsWith('https')
      },
      '/socket.io': {
        target: backend,
        changeOrigin: true,
        secure: backend.startsWith('https'),
        ws: true
      }
    }
  }
})
