import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
 
  plugins: [react()],
  resolve: {
    alias: {
      'react-dom/client': 'react-dom/client',
    },
  },
  server: {
    port: 3000,
  },
  build: {
    // Increase the chunk size warning limit to suppress the warning or make it less sensitive
    chunkSizeWarningLimit: 1000, // You can adjust this value as needed

    // Configure Rollup options to manually chunk your dependencies
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Extract react and react-dom into separate chunks
            if (id.includes('react')) {
              return 'react';
            }
            // Create a chunk for all other node_modules
            return 'vendor';
          }
        },
      },
    },
  },
});
