import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";

export default defineConfig({
  base: "./", // يمنع 404 للأصول على الموبايل/المسارات الفرعية
  plugins: [
    react(),
    legacy({ targets: ["defaults", "Android >= 7", "iOS >= 12"] }), // دعم WebView/أجهزة أقدم
  ],
  server: { host: true, port: 5173, strictPort: true },
});
