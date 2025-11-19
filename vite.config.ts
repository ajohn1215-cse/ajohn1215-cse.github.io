import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get base path from environment variable, default to '/' for local dev
// For GitHub Pages, this should be set to the repository name (e.g., '/ajohn1215-cse.FindMySpot/')
const base = process.env.VITE_BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})
