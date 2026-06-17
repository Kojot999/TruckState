import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: [
      { find: '@assets', replacement: '/src/assets' },
      { find: '@components', replacement: '/src/app/components' },
      { find: '@pages', replacement: '/src/app/pages' },
      { find: '@styles', replacement: '/src/styles' },
      { find: '@api', replacement: '/src/app/api' },
      { find: '@app', replacement: '/src/app' },
    ],
  },
});
