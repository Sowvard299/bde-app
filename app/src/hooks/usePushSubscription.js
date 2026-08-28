import { useCallback, useEffect, useState } from 'react'
import { OneSignal, initOneSignal } from '../lib/onesignal'

function envSupport() {
  return {
    secureContext: typeof window.isSecureContext === 'boolean' ? window.isSecureContext : 'n/a',
    serviceWorker: 'serviceWorker' in navigator,
    pushManager: 'PushManager' in window,
    notification: 'Notification' in window,
  }
}

export function usePushSubscription() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'unavailable'
  const [permission, setPermission] = useState(false)
  const [optedIn, setOptedIn] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    initOneSignal()
      .then((available) => {
        if (cancelled) return
        if (!available) {
          setError('VITE_ONESIGNAL_APP_ID manquant')
          setStatus('unavailable')
          return
        }

        setPermission(Boolean(OneSignal.Notifications.permission))
        setOptedIn(Boolean(OneSignal.User.PushSubscription.optedIn))
        setStatus('ready')

        const onPermissionChange = (value) => setPermission(Boolean(value))
        const onSubscriptionChange = (event) => setOptedIn(Boolean(event.current.optedIn))

        OneSignal.Notifications.addEventListener('permissionChange', onPermissionChange)
        OneSignal.User.PushSubscription.addEventListener('change', onSubscriptionChange)

        cleanup = () => {
          OneSignal.Notifications.removeEventListener('permissionChange', onPermissionChange)
          OneSignal.User.PushSubscription.removeEventListener('change', onSubscriptionChange)
        }
      })
      .catch((err) => {
        console.error('OneSignal init failed', err)
        if (cancelled) return
        const support = envSupport()
        const supportStr = Object.entries(support)
          .map(([k, v]) => `${k}=${v}`)
          .join(', ')
        setError(`${err?.message || String(err)} · ${supportStr}`)
        setStatus('unavailable')
      })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  const subscribe = useCallback(async () => {
    await initOneSignal()
    await OneSignal.Notifications.requestPermission()
    await OneSignal.User.PushSubscription.optIn()
  }, [])

  const unsubscribe = useCallback(async () => {
    await initOneSignal()
    await OneSignal.User.PushSubscription.optOut()
  }, [])

  return {
    ready: status === 'ready',
    loading: status === 'loading',
    unavailable: status === 'unavailable',
    error,
    permission,
    optedIn,
    subscribe,
    unsubscribe,
  }
}
