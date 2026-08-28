import { useState } from 'react'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIosSafari, isStandalone } from '../lib/platform'

export default function NotificationSettings() {
  const { ready, loading, unavailable, permission, optedIn, subscribe, unsubscribe } =
    usePushSubscription()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)

  const iosBlocked = isIosSafari() && !isStandalone()
  if (iosBlocked) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 p-4">
        <span className="font-display text-base font-semibold text-ink">Notifications</span>
        <p className="text-sm text-neutral-500">
          Sur iPhone, les notifications ne fonctionnent que si l'app est installée sur ton
          écran d'accueil. Installe-la d'abord pour pouvoir les activer.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 p-4">
        <span className="font-display text-base font-semibold text-ink">Notifications</span>
        <p className="text-sm text-neutral-500">Chargement…</p>
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-neutral-200 p-4">
        <span className="font-display text-base font-semibold text-ink">Notifications</span>
        <p className="text-sm text-neutral-500">
          Les notifications ne sont pas disponibles pour le moment sur cet appareil.
        </p>
      </div>
    )
  }

  if (!ready) return null

  const active = permission && optedIn

  async function handleClick() {
    setError(null)
    setBusy(true)
    try {
      await (active ? unsubscribe() : subscribe())
    } catch (err) {
      console.error(err)
      setError("Impossible de mettre à jour les notifications. Réessaie plus tard.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="font-display text-base font-semibold text-ink">Notifications</span>
          <p className="text-sm text-neutral-500">
            {active ? 'Activées pour les nouveaux événements' : 'Désactivées'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${
            active ? 'bg-neutral-100 text-neutral-700' : 'bg-accent text-white'
          }`}
        >
          {active ? 'Désactiver' : 'Activer'}
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
