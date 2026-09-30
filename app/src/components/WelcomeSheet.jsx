import { useEffect, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { usePushSubscription } from '../hooks/usePushSubscription'
import { isIos, isInAppBrowser, isMobileOrTablet, isStandalone } from '../lib/platform'
import IosInstallSheet from './IosInstallSheet'
import LogoMark from './LogoMark'

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
        className="fixed inset-0 z-40 flex items-end justify-center bg-ink/60 p-0 sm:items-center"
        onClick={close}
      >
        <div
          role="dialog"
          aria-label="Bienvenue"
          onClick={(event) => event.stopPropagation()}
          className="w-full max-w-[480px] border-2 border-b-0 border-ink bg-white p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:max-w-md sm:border-b-2 sm:mb-6 sm:shadow-[8px_8px_0_var(--color-ink)]"
        >
          <LogoMark className="h-10 w-10 text-ink" />
          <h2 className="masthead mt-4 text-4xl">BDE IAE Paris Sorbonne</h2>
          <p className="mt-2 text-fg-muted">
            Ajoutez le site à l'écran d'accueil pour retrouver l'agenda et les partenaires en un
            geste.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {canOfferInstall && (
              <button
                type="button"
                onClick={ios ? () => setShowIosSteps(true) : promptInstall}
                className="btn w-full"
              >
                Ajouter à l'écran d'accueil
              </button>
            )}

            {canOfferPush && (
              <button
                type="button"
                onClick={handlePush}
                className="btn-ghost w-full"
              >
                Activer les notifications
              </button>
            )}

            {pushDone && (
              <p className="label border-2 border-ink bg-accent-gold px-4 py-3 text-center">
                Notifications activées
              </p>
            )}

            {ios && (
              <p className="text-xs text-fg-subtle">
                Sur iPhone, les notifications ne sont disponibles qu'une fois le site ajouté à
                l'écran d'accueil.
              </p>
            )}

            <button
              type="button"
              onClick={close}
              className="label mt-1 px-4 py-2 text-center text-fg-muted underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
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
