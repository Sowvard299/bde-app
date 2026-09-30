import { useEffect, useRef, useState } from 'react'
import introLarge from '../assets/intro/intro-large.mp4'
import introMobile from '../assets/intro/intro-mobile.mp4'

const SEEN_KEY = 'bde-intro-seen'
const FONDU_MS = 450
// Si la vidéo n'a pas démarré dans ce délai (réseau lent, iPhone en mode
// économie d'énergie, qui bloque toute lecture automatique), on laisse
// directement la place au site : un écran blanc figé serait pire que pas
// d'intro du tout.
// Un peu plus long sur téléphone, où le réseau est souvent plus lent.
const DEMARRAGE_MAX_MS = 1500
const DEMARRAGE_MAX_MOBILE_MS = 3000
// Garde-fou absolu, quelle que soit la raison d'un blocage.
const DUREE_MAX_MS = 8000

// Sur un écran en hauteur (téléphone, app installée), la version
// verticale livrée par le BDE (bde_intro_app_mobile_1080x1920), réencodée
// en 720×1280 à 30 images/s : 2,4 Mo au lieu de 31, sans différence
// visible sur un téléphone. Sur un écran large, la version 16/9.
const INTRO_MOBILE = introMobile

function estEnHauteur() {
  return window.matchMedia('(max-aspect-ratio: 1/1)').matches
}

function sourceAdaptee() {
  return estEnHauteur() ? INTRO_MOBILE : introLarge
}

// Écran d'ouverture : la vidéo du blason, une fois par session.
//
// Une fois par session et pas une fois pour toutes : la rejouer à chaque
// changement de page serait pénible, mais la revoir en rouvrant l'app fait
// partie de l'arrivée. sessionStorage donne exactement ce comportement.
export default function IntroSplash() {
  const videoRef = useRef(null)
  const demarreRef = useRef(false)
  const [src] = useState(() => (typeof window === 'undefined' ? null : sourceAdaptee()))

  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'fini'
    // Qui a demandé moins d'animations à son système ne veut pas d'une
    // vidéo plein écran au démarrage.
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 'fini'
    try {
      if (sessionStorage.getItem(SEEN_KEY) === 'true') return 'fini'
    } catch {
      // sessionStorage inaccessible (navigation privée stricte) : on joue
      // l'intro, c'est moins grave que de planter au démarrage.
    }
    return 'lecture'
  })

  const sortir = () => setPhase((p) => (p === 'lecture' ? 'sortie' : p))

  useEffect(() => {
    if (phase !== 'lecture') return

    try {
      sessionStorage.setItem(SEEN_KEY, 'true')
    } catch {
      // Sans persistance l'intro se rejouera : acceptable.
    }

    const video = videoRef.current
    video?.play().catch(sortir)

    const demarrage = setTimeout(() => {
      if (!demarreRef.current) sortir()
    }, estEnHauteur() ? DEMARRAGE_MAX_MOBILE_MS : DEMARRAGE_MAX_MS)
    const plafond = setTimeout(sortir, DUREE_MAX_MS)

    return () => {
      clearTimeout(demarrage)
      clearTimeout(plafond)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'sortie') return
    const fondu = setTimeout(() => setPhase('fini'), FONDU_MS)
    return () => clearTimeout(fondu)
  }, [phase])

  useEffect(() => {
    if (phase !== 'lecture') return
    const touche = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') sortir()
    }
    document.addEventListener('keydown', touche)
    return () => document.removeEventListener('keydown', touche)
  }, [phase])

  if (phase === 'fini' || !src) return null

  return (
    <div className={`intro ${phase === 'sortie' ? 'intro--sortie' : ''}`} onClick={sortir}>
      <video
        ref={videoRef}
        src={src}
        muted
        autoPlay
        playsInline
        webkit-playsinline="true"
        preload="auto"
        disablePictureInPicture
        aria-hidden="true"
        onPlaying={() => {
          demarreRef.current = true
        }}
        onEnded={sortir}
        onError={sortir}
      />
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          sortir()
        }}
        className="label absolute bottom-6 right-5 px-2 py-1 text-fg-subtle transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        Passer
      </button>
    </div>
  )
}
