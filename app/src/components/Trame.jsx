import { Suspense, lazy } from 'react'
import { useMoinsDAnimations } from '../hooks/useMoinsDAnimations'
import RepliSurErreur from './RepliSurErreur'

const Dithering = lazy(() => import('../effets/shaders').then((m) => ({ default: m.Dithering })))

const ENCRE = '#0f1564'

// La trame : un tramage animé en deux aplats, le bleu nuit de la charte et
// la couleur de la série. C'est l'effet commun du site, repris des
// affiches sérigraphiées et des fanzines : pas de dégradé, pas de flou,
// des points francs. Chaque série a son motif (vagues pour le sport,
// tourbillon pour la culture, ondes pour la night, voir lib/series.js).
//
// Les réglages supplémentaires (offsetX, rotation…) passent tels quels au
// shader.
//
// Le bleu nuit est posé en fond du cadre : si WebGL manque, ou le temps
// que le shader arrive, on voit un aplat de la charte et pas un trou.
// L'animation s'arrête d'elle-même hors de l'écran et onglet caché, et
// reste figée si l'utilisateur a demandé moins d'animations.
export default function Trame({
  serie,
  taille = 3,
  vitesse = 0.4,
  echelle = 1,
  image = 0,
  className = '',
  children,
  ...reglages
}) {
  const fige = useMoinsDAnimations()

  return (
    <div className={`relative isolate overflow-hidden bg-ink ${className}`}>
      <RepliSurErreur>
        <Suspense fallback={null}>
          <Dithering
            aria-hidden="true"
            colorBack={ENCRE}
            colorFront={serie.hex}
            shape={serie.trame}
            type="4x4"
            size={taille}
            scale={echelle}
            speed={fige ? 0 : vitesse}
            frame={image}
            style={{ position: 'absolute', inset: 0, zIndex: -1 }}
            {...reglages}
          />
        </Suspense>
      </RepliSurErreur>
      {children}
    </div>
  )
}
