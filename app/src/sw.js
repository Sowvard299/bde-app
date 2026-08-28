import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

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

// OneSignal will register its own service worker for push (step 7). To avoid
// two workers fighting over the same scope, its script gets merged in here
// with importScripts('OneSignalSDKWorker.js') once push is wired up, instead
// of living at a separate URL.
