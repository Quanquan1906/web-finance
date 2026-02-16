import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import sitemap from 'vite-plugin-sitemap';
import imagemin from 'vite-plugin-imagemin';

export default defineConfig({
  plugins: [
    tanstackRouter({ 
      target: 'react',
      routesDirectory: './src/app/router',
      generatedRouteTree: './src/routeTree.gen.ts',
    }),
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      }
    }),
    sitemap(),
    imagemin({
      pngquant: {
        quality: [0.6, 0.8]
      },
      webp: {
        quality: 75
      }
    }),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom'
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: 5173
  },
  build: {
    minify: 'esbuild',
    sourcemap: false,
    cssCodeSplit: true
  }
});
