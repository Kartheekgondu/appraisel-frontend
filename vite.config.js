import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your framework plugin

export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_PATH || "/appraisel-frontend",
  server: {
    allowedHosts: ['computing-rematch-magnetic.ngrok-free.dev']
    // Or simply: allowedHosts: true
  }
})