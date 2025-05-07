import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/Organizer_React/',
  plugins: [
    react({ jsxRuntime: 'automatic' }), // Nur ein Plugin-Aufruf
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          bootstrap: ['react-bootstrap'],
          dateFns: ['date-fns'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});


