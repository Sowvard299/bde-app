import { useState } from 'react'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIosSafari, isStandalone } from '../lib/platform'

export default function NotificationSettings() {
  const { ready, loading, unavailable, error: initError, permission, optedIn, subscribe, unsubscribe } =
    usePushSubscription()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [debugInfo, setDebugInfo] = useState(null)

  const iosBlocked = isIosSafari() && !isStandalone()
  if (iosBlocked) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-line p-4">
        <span className="font-display text-base font-semibold text-fg">Notifications</span>
        <p className="text-sm text-fg-faint">
          Sur iPhone, les notifications ne fonctionnent que si l'app est installée sur ton
          écran d'accueil. Installe-la d'abord pour pouvoir les activer.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-line p-4">
        <span className="font-display text-base font-semibold text-fg">Notifications</span>
        <p className="text-sm text-fg-faint">Chargement…</p>
      </div>
    )
  }

  if (unavailable) {
    return (
      <div className="flex flex-col gap-1 rounded-2xl border border-line p-4">
        <span className="font-display text-base font-semibold text-fg">Notifications</span>
        <p className="text-sm text-fg-faint">
          Les notifications ne sont pas disponibles pour le moment sur cet appareil.
        </p>
        {initError && (
          <p className="mt-1 select-all break-words text-xs text-fg-subtle">{initError}</p>
        )}
      </div>
    )
  }

  if (!ready) return null

  const active = permission && optedIn

  async function handleClick() {
    setError(null)
    setDebugInfo(null)
    setBusy(true)
    try {
      if (active) {
        await unsubscribe()
        setDebugInfo('Désabonné')
      } else {
        const id = await subscribe()
        setDebugInfo(`Abonné · id=${id}`)
      }
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Impossible de mettre à jour les notifications.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-line p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="font-display text-base font-semibold text-fg">Notifications</span>
          <p className="text-sm text-fg-faint">
            {active ? 'Activées pour les nouveaux événements' : 'Désactivées'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleClick}
          disabled={busy}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${
            active ? 'bg-surface-muted text-fg-muted' : 'bg-accent text-white'
          }`}
        >
          {active ? 'Désactiver' : 'Activer'}
        </button>
      </div>
      {error && <p className="select-all break-words text-sm text-red-400">{error}</p>}
      {debugInfo && (
        <p className="select-all break-words text-xs text-fg-subtle">{debugInfo}</p>
      )}
    </div>
  )
}
