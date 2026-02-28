import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// When deploying to GitHub Pages the app lives at /<repo-name>/
// The VITE_BASE_PATH env var is set in the GitHub Actions workflow.
// Locally it defaults to '/' so dev mode works without config.
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH ?? '/',
})
