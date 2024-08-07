import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/ncp": {
        target: "https://kr.object.ncloudstorage.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ncp/, ""),
        secure: false,
        ws: true,
      },
      // "/api": {
      //   target: "http://223.130.160.171",
      //   changeOrigin: true,
      //   rewrite: (path) => path.replace(/^\/api/, ""),
      //   secure: false,
      //   ws: true,
      // },
    },
  },
});
