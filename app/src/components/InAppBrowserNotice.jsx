import { useEffect, useState } from 'react'
import { isInAppBrowser, isStandalone } from '../lib/platform'

// Instagram/TikTok/etc.'s built-in browser can't properly install the app
// or receive push notifications — not dismissible, since there's nothing to
// opt out of: it's a hard platform limitation, not a preference. Once the
// visitor actually opens the link in their real browser this stops matching
// and disappears on its own.
export default function InAppBrowserNotice() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    setShow(isInAppBrowser() && !isStandalone())
  }, [])

  if (!show) return null

  return (
    <div className="relative z-20 flex flex-col gap-1 bg-ink px-4 py-3 text-white lg:hidden">
      <p className="text-sm font-semibold">
        Ouvre ce lien dans ton navigateur pour tout activer
      </p>
      <p className="text-xs text-white/70">
        Depuis l'appli où tu es (Instagram, TikTok…), l'installation et les notifications ne
        fonctionnent pas. Appuie sur <strong>⋯</strong> ou l'icône de partage, puis choisis{' '}
        <strong>« Ouvrir dans le navigateur »</strong> (Safari, Chrome…) — c'est indispensable
        pour recevoir les infos en priorité grâce aux notifications.
      </p>
    </div>
  )
}
