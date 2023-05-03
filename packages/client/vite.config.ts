import { defineConfig, splitVendorChunkPlugin } from 'vite';
import { visualizer } from 'rollup-plugin-visualizer';
import react from '@vitejs/plugin-react';
import path from 'path';

const getManualChunks = (id: string) => {
  if (id.includes('node_modules')) {
    if (id.includes('lodash')) {
      return 'vendor_lodash';
    } else if (id.includes('@mui')) {
      return 'vendor_mui';
    } else if (id.includes('@apollo')) {
      return 'vendor_apollo';
    }
    return 'vendor';
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8001,
  },
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@util': path.resolve(__dirname, './src/util'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => getManualChunks(id),
      },
    },
  },
  assetsInclude: ['**/*.md'],
  plugins: [react(), splitVendorChunkPlugin(), visualizer()],
});
