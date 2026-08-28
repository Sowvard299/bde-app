import { useEffect, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { isIosSafari, isStandalone } from '../lib/platform'
import IosInstallSheet from './IosInstallSheet'

const DISMISS_KEY = 'bde-install-banner-dismissed'

export default function InstallBanner() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const [dismissed, setDismissed] = useState(true)
  const [showSheet, setShowSheet] = useState(false)
  const [standalone, setStandalone] = useState(true)

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === 'true')
    setStandalone(isStandalone())
  }, [])

  const showIosHint = isIosSafari()

  if (standalone || dismissed || (!canInstall && !showIosHint)) return null

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  return (
    <>
      <div className="sticky top-0 z-20 flex items-center justify-between gap-3 bg-ink px-4 py-2.5 text-white">
        <p className="text-sm">Installe l'app BDE sur ton écran d'accueil</p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={showIosHint ? () => setShowSheet(true) : promptInstall}
            className="rounded-full bg-accent px-3 py-1.5 text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Installer
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

      {showSheet && <IosInstallSheet onClose={() => setShowSheet(false)} />}
    </>
  )
}
