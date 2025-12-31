import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: false, // Disable source maps in production to prevent 404 errors
    rollupOptions: {
      output: {
        // Remove source map references completely
        sourcemapExcludeSources: true,
      },
    },
    // Minify to reduce file size and remove any source map hints
    minify: 'esbuild',
  },
  // Ensure no source maps are generated in any mode
  esbuild: {
    sourcemap: false,
    legalComments: 'none', // Remove comments that might reference source maps
  },
})
