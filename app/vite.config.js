import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
      manifest: {
        name: 'BDE IAE Paris Sorbonne',
        short_name: 'BDE Sorbonne',
        description:
          "Événements, partenaires et carte du BDE de l'IAE Paris Sorbonne",
        theme_color: '#0F1564',
        background_color: '#0F1564',
        display: 'standalone',
        start_url: '/',
        lang: 'fr',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'pwa-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
