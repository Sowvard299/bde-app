import { useEffect, useState } from 'react'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { canReceivePush, isStandalone } from '../lib/platform'

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
    // The app can be installed on a desktop too — never offer push there.
    if (!canReceivePush()) return
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
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 sm:items-center"
      onClick={close}
    >
      <div
        role="dialog"
        aria-label="Activer les notifications"
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[480px] border-2 border-b-0 border-ink bg-white p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:max-w-md sm:border-b-2 sm:mb-6 sm:shadow-[8px_8px_0_var(--color-ink)]"
      >
        <h2 className="masthead text-4xl">Notifications</h2>
        <p className="mt-2 text-fg-muted">
          Une alerte à chaque nouvel événement annoncé par le BDE. Rien d'autre.
        </p>

        {error && <p className="alert mt-4">{error}</p>}

        <div className="mt-6 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleActivate}
            disabled={busy}
            className="btn w-full"
          >
            {busy ? 'Activation en cours' : 'Activer les notifications'}
          </button>
          <button
            type="button"
            onClick={close}
            className="label px-4 py-2 text-center text-fg-muted underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  )
}
