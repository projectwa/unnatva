/**
 * Vite config for building standalone React components
 * These components will be embedded in CI4 views
 * 
 * Builds components as standalone bundles that can be included as scripts
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../public/js/react/components',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        carousel: path.resolve(__dirname, 'src/components/standalone/entry-points/carousel.js'),
        counters: path.resolve(__dirname, 'src/components/standalone/entry-points/counters.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name]-[hash].js',
        assetFileNames: '[name].[ext]',
        format: 'iife', // IIFE format for direct script inclusion
        inlineDynamicImports: false, // Explicitly set to false for multiple inputs
      },
    },
    // Bundle everything (including React) into each component
    // This makes components self-contained
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

