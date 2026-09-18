import { useEffect, useState } from 'react'
import LogoHyperzoom from './LogoHyperzoom'

const SEEN_KEY = 'bde-intro-seen'
const HOLD_MS = 2600
const FADE_MS = 600

// Ecran d'ouverture : le blason fonce vers l'ecran quelques secondes avant
// de laisser place a l'app.
//
// Une fois par session, pas une fois pour toutes : l'effet perd tout son
// interet s'il se declenche a chaque navigation interne, mais le revoir en
// rouvrant l'app le lendemain fait partie du plaisir. sessionStorage donne
// exactement ce comportement, sans rien demander a personne.
export default function IntroSplash() {
  const [phase, setPhase] = useState(() => {
    if (typeof window === 'undefined') return 'done'

    // Respecter le reglage systeme : quelqu'un qui a demande moins
    // d'animations ne veut certainement pas d'un zoom plein ecran.
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) return 'done'

    try {
      if (sessionStorage.getItem(SEEN_KEY) === 'true') return 'done'
    } catch {
      // sessionStorage inaccessible (navigation privee stricte) : on
      // montre l'intro, c'est moins grave que de planter au demarrage.
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
      <LogoHyperzoom className="absolute inset-0" />

      <p className="intro-splash__wordmark">
        BDE IAE
        <span className="block">Paris Sorbonne</span>
      </p>
    </div>
  )
}
