import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env.URL_BACK": JSON.stringify(env.URL_BACK || "http://localhost:4000"),
    },
    server: {
      allowedHosts: ["barb-illtempered-nakia.ngrok-free.dev"]
    }
  }
})
