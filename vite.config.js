import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ["computing-rematch-magnetic.ngrok-free.dev"],
    proxy: {
      "/backend": {
        target: "http://localhost:9090",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ""),
      },
    },
  },
});
