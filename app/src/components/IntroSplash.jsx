import { useEffect, useRef, useState } from 'react'
import introLarge from '../assets/intro/intro-large.mp4'
import introCarre from '../assets/intro/intro-carre.mp4'

const SEEN_KEY = 'bde-intro-seen'
const FONDU_MS = 450
// Si la vidéo n'a pas démarré dans ce délai (réseau lent, iPhone en mode
// économie d'énergie, qui bloque toute lecture automatique), on laisse
// directement la place au site : un écran blanc figé serait pire que pas
// d'intro du tout.
const DEMARRAGE_MAX_MS = 1500
// Garde-fou absolu, quelle que soit la raison d'un blocage.
const DUREE_MAX_MS = 6000

// La vidéo est composée en 16/9 avec le blason au centre. Sur un écran en
// hauteur, elle tiendrait dans une bande étroite et le blason serait
// minuscule : on sert alors une version recadrée en carré sur le blason.
function sourceAdaptee() {
  return window.matchMedia('(max-aspect-ratio: 1/1)').matches ? introCarre : introLarge
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
    }, DEMARRAGE_MAX_MS)
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
