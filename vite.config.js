import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  // relative asset URLs, so a built copy runs from any folder or static host
  base: './',

  server: {
    port: 5178,
    // Bound to loopback on purpose. Vite 5 ships an esbuild with a known
    // dev-server advisory (GHSA-67mh-4wv8-2f99); keeping the dev server off
    // the network is the mitigation available on Node 18. See README.
    host: '127.0.0.1',
    open: false,
  },

  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        // three.js is most of the bundle and changes far less often than the
        // app, so give it its own long-lived chunk
        manualChunks: { three: ['three'] },
      },
    },
  },
})
