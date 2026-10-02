import { Suspense, lazy, useRef } from 'react'
import { useMoinsDAnimations } from '../hooks/useMoinsDAnimations'
import { useProcheDeLEcran } from '../hooks/useProcheDeLEcran'
import LogoMark from './LogoMark'
import RepliSurErreur from './RepliSurErreur'

const PhenixMetal = lazy(() => import('../effets/shaders').then((m) => ({ default: m.PhenixMetal })))

// Le phénix du BDE en métal liquide. Pièce unique du site, posée dans le
// pied de page bleu nuit : le chrome y ressort, et l'effet ne gêne la
// lecture de rien. Tant qu'il n'est pas près de l'écran (ou si WebGL
// manque), c'est le phénix à plat qui s'affiche, à la même taille.
export default function PhenixChrome({ className = 'h-24 w-24', teinte }) {
  const ref = useRef(null)
  const proche = useProcheDeLEcran(ref)
  const fige = useMoinsDAnimations()
  const repli = <LogoMark className={`text-white ${className}`} />

  return (
    <span ref={ref} aria-hidden="true" className="relative inline-block shrink-0">
      {proche ? (
        <RepliSurErreur repli={repli}>
          <Suspense fallback={repli}>
            <PhenixMetal className={`block ${className}`} teinte={teinte} vitesse={fige ? 0 : 0.6} />
          </Suspense>
        </RepliSurErreur>
      ) : (
        repli
      )}
    </span>
  )
}
