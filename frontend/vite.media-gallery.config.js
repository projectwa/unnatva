/**
 * Vite config for building Media Gallery component only
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': '{}',
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  build: {
    outDir: '../public/js/react/components',
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, 'src/components/standalone/entry-points/media-gallery.js'),
      name: 'MediaGallery',
      formats: ['iife'],
      fileName: () => 'media-gallery.js',
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

