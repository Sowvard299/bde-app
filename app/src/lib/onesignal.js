import OneSignal from 'react-onesignal'
import { canReceivePush } from './platform'

const appId = import.meta.env.VITE_ONESIGNAL_APP_ID

let initPromise = null

export function initOneSignal() {
  if (!appId) return Promise.resolve(false)
  // Never load the SDK on desktop — without init there is no subscription to
  // register, so a computer can never end up receiving push notifications.
  if (!canReceivePush()) return Promise.resolve(false)

  if (!initPromise) {
    initPromise = OneSignal.init({
      appId,
      // Our own service worker (registered by vite-plugin-pwa) already owns
      // this scope. Point OneSignal at it instead of letting it register a
      // second worker, which would collide — src/OneSignalSDKWorker.js
      // merges OneSignal's push handlers in via importScripts.
      serviceWorkerParam: { scope: '/' },
      serviceWorkerPath: 'OneSignalSDKWorker.js',
      // Kill the floating bell widget — we only ever ask for permission
      // through our own buttons/popups.
      notifyButton: { enable: false },
      // Never show OneSignal's own automatic prompt — permission is only
      // ever requested from our own button, after a real tap.
      promptOptions: {
        slidedown: {
          prompts: [{ type: 'push', autoPrompt: false, delay: { pageViews: 99999, timeDelay: 99999 } }],
        },
      },
    }).then(() => true)
  }

  return initPromise
}

export { OneSignal }
