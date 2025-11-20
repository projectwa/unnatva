import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  
  return {
    plugins: [react()],
    build: {
      outDir: '../public/js/react',
      // Don't empty the directory - preserve the components folder
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(__dirname, 'src/main.jsx'),
        output: {
          entryFileNames: 'app.js',
          chunkFileNames: 'chunks/[name]-[hash].js',
          assetFileNames: 'assets/[name].[ext]',
        },
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': {
          target: 'http://lhunnatva',
          changeOrigin: true,
        },
        // Proxy static assets to CI4 public directory
        '/img': {
          target: 'http://lhunnatva',
          changeOrigin: true,
        },
        '/assets': {
          target: 'http://lhunnatva',
          changeOrigin: true,
        },
        '/lib': {
          target: 'http://lhunnatva',
          changeOrigin: true,
        },
        '/js': {
          target: 'http://lhunnatva',
          changeOrigin: true,
        },
      },
    },
    // Base path - empty for absolute paths (served from /js/react/app.js)
    base: '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});

