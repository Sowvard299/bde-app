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
      // OneSignal's SDK checks for a service worker at this exact default
      // filename regardless of the serviceWorkerPath override, so our merged
      // worker keeps this name instead of "sw.js".
      filename: 'OneSignalSDKWorker.js',
      registerType: 'autoUpdate',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      },
      manifest: {
        name: 'BDE IAE Paris Sorbonne',
        short_name: 'BDE Sorbonne',
        description:
          "Événements, partenaires et carte du BDE de l'IAE Paris Sorbonne",
        theme_color: '#0A0A12',
        background_color: '#0A0A12',
        display: 'standalone',
        // Pointe l'adresse canonique : « / » redirige desormais (301).
        start_url: '/accueil',
        // Identifiant stable de l'application. Sans lui, le navigateur
        // deduit l'identite de start_url : le jour ou celle-ci change,
        // l'app installee est vue comme une autre app et l'installation
        // en place se perd.
        id: '/accueil',
        lang: 'fr',
        categories: ['education', 'lifestyle', 'social'],
        // Actions rapides sur appui long de l'icone. Les trois pages ou
        // l'on va reellement quand on ouvre l'app.
        shortcuts: [
          {
            name: 'Prochains evenements',
            short_name: 'Evenements',
            url: '/evenements',
            icons: [{ src: 'pwa-192.png', sizes: '192x192' }],
          },
          {
            name: 'Bars de Paris',
            short_name: 'Bars',
            url: '/bars',
            icons: [{ src: 'pwa-192.png', sizes: '192x192' }],
          },
          {
            name: 'Reductions etudiantes',
            short_name: 'Partenaires',
            url: '/partenaires',
            icons: [{ src: 'pwa-192.png', sizes: '192x192' }],
          },
        ],
        // Captures affichees dans la fenetre d'installation d'Android et
        // dans les vitrines d'applications. Sans elles, le navigateur
        // propose une boite d'installation minimale.
        screenshots: [
          {
            src: 'capture-mobile-accueil.png',
            sizes: '480x1000',
            type: 'image/png',
            form_factor: 'narrow',
            label: "Accueil : le prochain evenement et le compte a rebours",
          },
          {
            src: 'capture-mobile-bars.png',
            sizes: '480x1000',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'La carte des 193 bars de Paris',
          },
          {
            src: 'capture-bureau-accueil.png',
            sizes: '1280x800',
            type: 'image/png',
            form_factor: 'wide',
            label: "Accueil du site du BDE",
          },
        ],
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
