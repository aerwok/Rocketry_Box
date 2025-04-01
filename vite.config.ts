import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Add explicit handling for directory imports
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
  },
  // Ensure proper base path handling for Vercel and other deployments
  base: '/',
  build: {
    // Generate a 404.html file that redirects to index.html for SPA routing
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        }
      }
    },
    // Add build options to help with troubleshooting
    sourcemap: true,
    chunkSizeWarningLimit: 1600,
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  // Configure server for Windows compatibility
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..'],
    },
  },
  // Handle Windows path issues
  optimizeDeps: {
    force: true,
    esbuildOptions: {
      platform: 'browser'
    }
  }
})
