import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase chunk size warning limit
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          react: ['react', 'react-dom', 'react-router-dom'],
          vendor: ['axios', 'zustand', '@tanstack/react-query'],
        },
      },
    },
  },
  server: {
    historyApiFallback: true,
  },
  base: '/', // Ensure base URL is set correctly
});
