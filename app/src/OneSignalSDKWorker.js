import { clientsClaim } from 'workbox-core'
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { CacheFirst, NetworkFirst } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Merges OneSignal's push handlers into this same service worker/scope
// instead of registering a second worker, which would collide with this one.
importScripts('https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js')

self.skipWaiting()
clientsClaim()
cleanupOutdatedCaches()

// App shell (JS/CSS/HTML/icons) so the app opens instantly, even offline.
precacheAndRoute(self.__WB_MANIFEST)

// Supabase data (events, partners): always prefer a fresh network response
// so an edited row (a corrected logo, a fixed date) shows up immediately.
// The cache is only a fallback for when the network genuinely fails
// (offline, or Supabase itself down) — StaleWhileRevalidate used to serve
// yesterday's cached response first and silently fail to refresh it in the
// background whenever Supabase returned an error, so an update could stay
// invisible indefinitely. Cache name bumped to drop those stale entries.
registerRoute(
  ({ url }) => url.hostname.endsWith('.supabase.co'),
  new NetworkFirst({ cacheName: 'supabase-api-v2', networkTimeoutSeconds: 6 })
)

// Event/partner images already viewed stay available offline.
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 })],
  })
)
