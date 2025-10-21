import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // Development server configuration
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/dashboard': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/orderbook': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/tradebook': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/positions': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/holdings': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/logs': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/search': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/tradingview': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/apikey': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        ws: true,
      }
    }
  },

  // Build optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: false,
    
    // Minification
    minify: 'terser',
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true, // Remove debugger statements
      },
    },
    
    // Rollup options
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunk for React and related libraries
          vendor: ['react', 'react-dom', 'react-router-dom'],
          
          // Socket.IO and real-time features
          socket: ['socket.io-client'],
          
          // HTTP client
          http: ['axios'],
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const extType = info[info.length - 1];
          
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          
          if (/\.(mp3|wav|ogg|flac)$/i.test(assetInfo.name || '')) {
            return `assets/sounds/[name]-[hash][extname]`;
          }
          
          if (extType === 'css') {
            return `assets/css/[name]-[hash][extname]`;
          }
          
          return `assets/[name]-[hash][extname]`;
        },
        
        // Chunk file naming
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    // Asset size warning limit
    assetsInlineLimit: 4096,
  },

  // Preview server (for production build testing)
  preview: {
    port: 4173,
    host: true,
  },

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0'),
  },

  // CSS optimization
  css: {
    devSourcemap: true,
  },
})