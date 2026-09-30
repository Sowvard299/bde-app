import { useEffect, useState } from 'react'
import { isInAppBrowser, isStandalone } from '../lib/platform'

// Instagram/TikTok/etc.'s built-in browser can't properly install the app
// or receive push notifications. Not dismissible, since there's nothing to
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
    <div className="relative z-20 flex flex-col gap-1 border-b-2 border-ink bg-accent-gold px-5 py-3 text-ink lg:hidden">
      <p className="label">Ouvrir dans le navigateur</p>
      <p className="text-xs leading-relaxed">
        Depuis Instagram ou TikTok, l'installation et les notifications ne fonctionnent pas.
        Touchez « ⋯ » ou l'icône de partage, puis « Ouvrir dans le navigateur ».
      </p>
    </div>
  )
}
