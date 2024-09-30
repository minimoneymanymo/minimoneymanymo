import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "node:url"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://finopenapi.ssafy.io/ssafy/api/v1/edu",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    rollupOptions: {
      // output: {
      //   manualChunks: {
      //     "react-vendors": ["react", "react-dom"],
      //     "mui-vendors": ["@mui/material", "@mui/icons-material"],
      //     "ignite-vendors": ["igniteui-react", "igniteui-react-charts"],
      //   },
      // },
      external: [
        "react",
        "react-dom",
        "igniteui-react",
        "igniteui-react-charts",
        "@mui/material",
        "@mui/icons-material",
      ],
    },
  },
})
