import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIosSafari, isStandalone } from '../lib/platform'

export default function NotificationSettings() {
  const { ready, permission, optedIn, subscribe, unsubscribe } = usePushSubscription()

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

  if (!ready) return null

  const active = permission && optedIn

  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-4">
      <div>
        <span className="font-display text-base font-semibold text-ink">Notifications</span>
        <p className="text-sm text-neutral-500">
          {active ? 'Activées pour les nouveaux événements' : 'Désactivées'}
        </p>
      </div>
      <button
        type="button"
        onClick={active ? unsubscribe : subscribe}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
          active ? 'bg-neutral-100 text-neutral-700' : 'bg-accent text-white'
        }`}
      >
        {active ? 'Désactiver' : 'Activer'}
      </button>
    </div>
  )
}
