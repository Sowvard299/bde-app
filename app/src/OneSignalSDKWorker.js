import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Merges OneSignal's push handlers into this same service worker/scope
// instead of registering a second worker, which would collide with this one.
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()

// App shell (JS/CSS/HTML/icons) so the app opens instantly, even offline.
precacheAndRoute(self.__WB_MANIFEST)

// Supabase data (events, partners) already fetched once stays available offline.
registerRoute(
  ({ url }) => url.hostname.endsWith('.supabase.co'),
  new StaleWhileRevalidate({ cacheName: 'supabase-api' })
)

// Event/partner images already viewed stay available offline.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
)
