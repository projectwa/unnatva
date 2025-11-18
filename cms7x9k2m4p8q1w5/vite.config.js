import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public/cms7x9k2m4p8q1w5',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/main.jsx'),
      output: {
        format: 'iife', // IIFE format - execute immediately
        entryFileNames: 'app.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]',
        name: 'CMSApp', // Global name
      },
    },
  },
  server: {
    port: 3001,
    proxy: {
      '/cms7x9k2m4p8q1w5/api': {
        target: 'http://lhunnatva',
        changeOrigin: true,
      },
    },
  },
  base: '/cms7x9k2m4p8q1w5/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

