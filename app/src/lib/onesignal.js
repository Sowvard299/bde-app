import OneSignal from 'react-onesignal'

const appId = import.meta.env.VITE_ONESIGNAL_APP_ID

let initPromise = null

export function initOneSignal() {
  if (!appId) return Promise.resolve(false)

  if (!initPromise) {
    initPromise = OneSignal.init({
      appId,
      // Our own service worker (registered by vite-plugin-pwa) already owns
      // this scope. Point OneSignal at it instead of letting it register a
      // second worker, which would collide — src/sw.js merges OneSignal's
      // push handlers in via importScripts.
      serviceWorkerParam: { scope: '/' },
      serviceWorkerPath: 'sw.js',
    }).then(() => true)
  }

  return initPromise
}

export { OneSignal }
