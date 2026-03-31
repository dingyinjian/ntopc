import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      /** 浏览器直连 ip-api 会混合内容/CORS 问题，开发时走本地代理拿中文省市区 */
      "/geo-ip": {
        target: "http://ip-api.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo-ip/, "/json"),
      },
      /** 高德 IP 定位（开发代理，避免跨域） */
      "/geo-ip-amap": {
        target: "https://restapi.amap.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/geo-ip-amap/, "/v3/ip"),
      },
    },
  },
  plugins: [vue()],
});

