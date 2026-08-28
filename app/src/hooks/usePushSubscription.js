import { useCallback, useEffect, useState } from 'react'
import { OneSignal, initOneSignal } from '../lib/onesignal'

export function usePushSubscription() {
  const [status, setStatus] = useState('loading') // 'loading' | 'ready' | 'unavailable'
  const [permission, setPermission] = useState(false)
  const [optedIn, setOptedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    initOneSignal()
      .then((available) => {
        if (cancelled) return
        if (!available) {
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
        if (!cancelled) setStatus('unavailable')
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
    permission,
    optedIn,
    subscribe,
    unsubscribe,
  }
}
