import { useEffect, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIos, isInAppBrowser, isMobileOrTablet, isStandalone } from '../lib/platform'
import IosInstallSheet from './IosInstallSheet'
import logoWhite from '../assets/logo-mark-white.png'

const SEEN_KEY = 'bde-welcome-seen'

// Shown once, on the very first visit, and only on a phone or tablet —
// installing to the home screen and push notifications are both meaningless
// on desktop, so nothing pops up there.
export default function WelcomeSheet() {
  const { canInstall, promptInstall } = useInstallPrompt()
  const { ready, permission, optedIn, subscribe } = usePushSubscription()
  const [firstVisit, setFirstVisit] = useState(false)
  const [showIosSteps, setShowIosSteps] = useState(false)
  const [pushDone, setPushDone] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(SEEN_KEY) === 'true') return
    if (!isMobileOrTablet()) return
    if (isStandalone()) return
    // Its install/notification steps don't work from an in-app browser —
    // InAppBrowserNotice tells people to open the link properly instead.
    if (isInAppBrowser()) return
    setFirstVisit(true)
  }, [])

  function close() {
    localStorage.setItem(SEEN_KEY, 'true')
    setFirstVisit(false)
  }

  async function handlePush() {
    try {
      await subscribe()
      setPushDone(true)
    } catch (err) {
      console.error(err)
    }
  }

  // Any iOS browser, not just Safari — people often open the link from
  // WhatsApp/Instagram, and the "add to home screen" steps still apply.
  const ios = isIos()
  // On iOS, push only works from the installed app, so we point people at the
  // install step instead of offering a button that would silently do nothing.
  const canOfferPush = ready && !ios && !permission && !optedIn && !pushDone
  const canOfferInstall = canInstall || ios

  // Nothing to propose (browser refuses the install prompt and push is
  // unavailable) — better no popup at all than one with only "Plus tard".
  if (!firstVisit || (!canOfferInstall && !canOfferPush && !pushDone)) return null

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 p-0"
        onClick={close}
      >
        <div
          role="dialog"
          aria-label="Bienvenue"
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-[480px] rounded-t-2xl bg-surface p-6 pb-8"
        >
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line" />

          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink">
              <img src={logoWhite} alt="" className="h-8 w-8" />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-fg">
                Bienvenue au BDE IAE Paris Sorbonne
              </h2>
              <p className="text-sm text-fg-faint">
                Installe l'app pour un accès rapide à tes événements
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-2">
            {canOfferInstall && (
              <button
                type="button"
                onClick={ios ? () => setShowIosSteps(true) : promptInstall}
                className="rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Ajouter à mon écran d'accueil
              </button>
            )}

            {canOfferPush && (
              <button
                type="button"
                onClick={handlePush}
                className="rounded-full border border-line px-4 py-3 text-center text-sm font-semibold text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Activer les notifications
              </button>
            )}

            {pushDone && (
              <p className="rounded-full bg-surface-muted px-4 py-3 text-center text-sm text-fg-muted">
                Notifications activées ✓
              </p>
            )}

            {ios && (
              <p className="px-1 text-xs text-fg-subtle">
                Sur iPhone, les notifications ne sont disponibles qu'une fois l'app ajoutée
                à l'écran d'accueil.
              </p>
            )}

            <button
              type="button"
              onClick={close}
              className="mt-1 px-4 py-2 text-center text-sm font-medium text-fg-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Plus tard
            </button>
          </div>
        </div>
      </div>

      {showIosSteps && <IosInstallSheet onClose={() => setShowIosSteps(false)} />}
    </>
  )
}
