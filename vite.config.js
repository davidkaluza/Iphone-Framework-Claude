import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// GitHub Pages Projekt-Site liegt unter /<repo-name>/
const BASE_PATH = "/Iphone-Framework-Claude/";

export default defineConfig({
  base: BASE_PATH,
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        name: "PWA Framework",
        short_name: "PWA App",
        description: "Minimalistisches React-PWA-Grundgerüst, optimiert für iOS/iPadOS.",
        start_url: BASE_PATH,
        scope: BASE_PATH,
        display: "standalone",
        orientation: "portrait",
        background_color: "#0f0f14",
        theme_color: "#6366f1",
        icons: [
          {
            src: "icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any"
          },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico}"],
        navigateFallback: "index.html"
      },
      devOptions: {
        enabled: true
      }
    })
  ]
});
