import { useEffect, useState } from 'react'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIosSafari, isStandalone } from '../lib/platform'

const VIEWED_EVENT_KEY = 'bde-viewed-event'
const DISMISS_KEY = 'bde-push-banner-dismissed'

export function markEventViewed() {
  localStorage.setItem(VIEWED_EVENT_KEY, 'true')
}

export default function PushOptInBanner() {
  const { ready, permission, optedIn, subscribe } = usePushSubscription()
  const [eligible, setEligible] = useState(false)

  useEffect(() => {
    const hasViewedEvent = localStorage.getItem(VIEWED_EVENT_KEY) === 'true'
    const dismissed = localStorage.getItem(DISMISS_KEY) === 'true'
    // iOS only supports push once the app runs from the home screen —
    // requesting permission from a plain Safari tab silently does nothing.
    const iosBlocked = isIosSafari() && !isStandalone()
    setEligible(hasViewedEvent && !dismissed && !iosBlocked)
  }, [])

  if (!ready || !eligible || permission || optedIn) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setEligible(false)
  }

  return (
    <div className="relative z-20 flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-white">
      <p className="text-sm">Active les notifications pour ne rater aucun événement</p>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={subscribe}
          className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          Activer
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Fermer"
          className="p-1 text-white/70 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
