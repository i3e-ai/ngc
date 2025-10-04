// vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// This is the optimized configuration for performance
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log'], // Remove specific functions
      },
    },
    
    // Code splitting and chunk optimization
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          // Separate chunk for large libraries
          'utils': ['./scripts/aem.js'],
        },
        // Optimize chunk file names for caching
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    
    // Optimize bundle size
    target: 'es2015', // Modern browsers support
    cssCodeSplit: true, // Split CSS into separate files
    sourcemap: false, // Disable sourcemaps in production for smaller files
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
  },
  
  // Development server optimizations
  server: {
    // Enable HTTP/2 for better multiplexing
    https: false, // Set to true if you have SSL certificates
    
    // Optimize dev server
    hmr: {
      overlay: false, // Disable error overlay for better performance
    },
  },
  
  // CSS optimizations
  css: {
    devSourcemap: false, // Disable CSS sourcemaps in dev
    preprocessorOptions: {
      // Add any CSS preprocessor options here
    },
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client'],
    // Force pre-bundling of these dependencies
    force: true,
  },
  
  // Asset handling
  assetsInclude: ['**/*.woff2', '**/*.woff'],
});