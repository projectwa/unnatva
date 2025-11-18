/**
 * Vite config for building Counters component only
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
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/components/standalone/entry-points/counters.js'),
      name: 'Counters',
      formats: ['iife'],
      fileName: () => 'counters.js',
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        inlineDynamicImports: true,
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

