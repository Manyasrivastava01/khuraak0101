import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',          // broader mobile browser support
    cssCodeSplit: true,
    minify: 'esbuild',
    // Compress assets aggressively
    assetsInlineLimit: 4096,   // inline tiny assets < 4 KB as base64
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // React core — always needed
            if (id.includes('react-dom') || id.includes('/react/')) {
              return 'vendor-react'
            }
            // Router — needed on every page
            if (id.includes('react-router-dom') || id.includes('react-router') || id.includes('@remix-run')) {
              return 'vendor-router'
            }
            // Icons — large but tree-shakeable; keep separate
            if (id.includes('react-icons')) {
              return 'vendor-icons'
            }
            // SEO helmet
            if (id.includes('react-helmet-async')) {
              return 'vendor-helmet'
            }
            // Supabase — ONLY load when admin/reservations/events pages are visited
            if (id.includes('@supabase') || id.includes('supabase')) {
              return 'vendor-supabase'
            }
            // Framer motion — heavy, isolate
            if (id.includes('framer-motion')) {
              return 'vendor-motion'
            }
            // Everything else (react-hot-toast, etc.) — fold into react bundle
            return 'vendor-react'
          }
        },
      },
    },
    chunkSizeWarningLimit: 400,
  },
})
