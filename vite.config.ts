import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',  // ✅ Fix relative paths for Vercel
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
    target: 'esnext',
    modulePreload: { polyfill: false },
    cssCodeSplit: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: undefined, // 🔥 Remove manualChunks to avoid chunking issues
        entryFileNames: 'assets/[name]-[hash].js', // ✅ Use hashed filenames to prevent caching issues
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  }
})
