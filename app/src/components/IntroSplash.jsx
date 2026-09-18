import { useEffect, useState } from 'react'
import logoBadge from '../assets/logo-badge-navy.png'

const SEEN_KEY = 'bde-intro-seen'
const HOLD_MS = 1800
const FADE_MS = 500

// Ecran d'ouverture : le blason grandit a l'ecran, puis laisse la place au
// site.
//
// Une fois par session, pas une fois pour toutes : l'intro perdrait tout
// son interet en se declenchant a chaque navigation interne, mais la revoir
// en rouvrant l'app plus tard fait partie de l'arrivee. sessionStorage
// donne exactement ce comportement sans rien demander a personne.
export default function IntroSplash() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'done'

    // Respecter le reglage systeme : quelqu'un qui a demande moins
    // d'animations ne veut pas d'un plein ecran anime au demarrage.
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return 'done'

    try {
      if (sessionStorage.getItem(SEEN_KEY) === 'true') return 'done'
    } catch {
      // sessionStorage inaccessible (navigation privee stricte) : on joue
      // l'intro, c'est moins grave que de planter au demarrage.
    }

    return 'playing'
  })

  useEffect(() => {
    if (phase !== 'playing') return

    try {
      sessionStorage.setItem(SEEN_KEY, 'true')
    } catch {
      // Sans persistance l'intro se rejouera : acceptable.
    }

    const hold = setTimeout(() => setPhase('leaving'), HOLD_MS)
    return () => clearTimeout(hold)
  }, [phase])

  useEffect(() => {
    if (phase !== 'leaving') return
    const fade = setTimeout(() => setPhase('done'), FADE_MS)
    return () => clearTimeout(fade)
  }, [phase])

  if (phase === 'done') return null

  return (
    <div
      className={`intro-splash ${phase === 'leaving' ? 'intro-splash--leaving' : ''}`}
      onClick={() => setPhase('leaving')}
      role="presentation"
    >
      <img src={logoBadge} alt="" className="intro-splash__logo" />
    </div>
  )
}
