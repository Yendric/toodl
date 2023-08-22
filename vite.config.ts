import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["img/*.jpg", "favicon.ico", "logo192.png", "logo512.png"],
      workbox: {
        maximumFileSizeToCacheInBytes: 4000000,
      },
      manifest: {
        short_name: "Toodl",
        name: "Toodl",
        description:
          "Maak een planning of todolijstje in slechts een paar klikken. Altijd beschikbaar op al uw apparaten!",
        icons: [
          {
            src: "favicon.ico",
            sizes: "64x64 32x32 24x24 16x16",
            type: "image/x-icon",
          },
          {
            src: "logo192.png",
            type: "image/png",
            sizes: "192x192",
          },
          {
            src: "logo512.png",
            type: "image/png",
            sizes: "512x512",
          },
        ],
        start_url: "/todos",
        display: "standalone",
        theme_color: "#1976d2",
        background_color: "#ffffff",
      },
    }),
  ],
});
