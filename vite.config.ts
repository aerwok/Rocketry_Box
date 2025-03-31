import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select'],
        },
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsDir: 'assets',
    emptyOutDir: true,
    target: 'esnext',
    modulePreload: true,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
    },
    reportCompressedSize: false,
  },
  server: {
    port: 3000,
  },
})
