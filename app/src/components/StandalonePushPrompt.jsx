import { useEffect, useState } from 'react'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isStandalone } from '../lib/platform'

const SEEN_KEY = 'bde-standalone-push-seen'

// Shown once, only once the app is actually running from the home screen
// icon (standalone mode) — this is the moment push notifications become
// possible on iOS, and the natural moment to ask on Android too.
export default function StandalonePushPrompt() {
  const { ready, permission, optedIn, subscribe } = usePushSubscription()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY) === 'true') return
    if (!isStandalone()) return
    setOpen(true)
  }, [])

  function close() {
    localStorage.setItem(SEEN_KEY, 'true')
    setOpen(false)
  }

  async function handleActivate() {
    setBusy(true)
    setError(null)
    try {
      await subscribe()
      close()
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Impossible d’activer les notifications.')
    } finally {
      setBusy(false)
    }
  }

  if (!open || !ready || permission || optedIn) return null

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/60"
      onClick={close}
    >
      <div
        role="dialog"
        aria-label="Activer les notifications"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-2xl bg-surface p-6 pb-8"
      >
        <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />

        <h2 className="font-display text-lg font-semibold text-fg">Active les notifications</h2>
        <p className="mt-1 text-sm text-fg-faint">
          Sois prévenu dès qu'un nouvel événement du BDE est annoncé.
        </p>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={handleActivate}
            disabled={busy}
            className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white transition disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {busy ? 'Activation…' : 'Activer les notifications'}
          </button>
          <button
            type="button"
            onClick={close}
            className="px-4 py-2 text-center text-sm font-medium text-fg-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
