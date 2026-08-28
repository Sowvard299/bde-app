import { useCallback, useEffect, useState } from 'react'
import { OneSignal, initOneSignal } from '../lib/onesignal'

export function usePushSubscription() {
  const [ready, setReady] = useState(false)
  const [permission, setPermission] = useState(false)
  const [optedIn, setOptedIn] = useState(false)

  useEffect(() => {
    let cancelled = false
    let cleanup = () => {}

    initOneSignal().then((available) => {
      if (cancelled || !available) return

      setPermission(Boolean(OneSignal.Notifications.permission))
      setOptedIn(Boolean(OneSignal.User.PushSubscription.optedIn))
      setReady(true)

      const onPermissionChange = (value) => setPermission(Boolean(value))
      const onSubscriptionChange = (event) => setOptedIn(Boolean(event.current.optedIn))

      OneSignal.Notifications.addEventListener('permissionChange', onPermissionChange)
      OneSignal.User.PushSubscription.addEventListener('change', onSubscriptionChange)

      cleanup = () => {
        OneSignal.Notifications.removeEventListener('permissionChange', onPermissionChange)
        OneSignal.User.PushSubscription.removeEventListener('change', onSubscriptionChange)
      }
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

  return { ready, permission, optedIn, subscribe, unsubscribe }
}
