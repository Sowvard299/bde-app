import logoWhite from '../assets/logo-mark-white.png'

// Effet « hyperzoom » : le blason fonce vers l'ecran en boucle continue,
// avec une aberration chromatique et une deformation liquide.
//
// La reference (technoparade.fr) le fait avec une video pre-rendue de
// 3,25s en boucle. Ici c'est refait en CSS + filtre SVG : cette app a une
// longue histoire de videos qui refusent de demarrer sur iOS (Low Power
// Mode, autoplay bloque, atome moov mal place), et un element aussi
// central ne peut pas dependre de ca. Bonus : c'est net a toutes les
// tailles d'ecran et ca ne pese rien.
//
// Le zoom infini repose sur deux exemplaires identiques decales d'une
// demi-duree : quand le premier disparait en fondu apres avoir depasse
// l'ecran, le second est deja a mi-parcours, donc le flux ne s'interrompt
// jamais et la boucle est invisible.
//
// L'aberration chromatique empile trois calques du meme blason, colores
// par `mask-image` plutot que par des filtres de teinte : le masque
// decoupe la forme et laisse le fond plein la colorer, ce qui donne des
// aplats exacts de la charte au lieu d'approximations.
function ZoomInstance({ delay }) {
  return (
    <div className="hyperzoom__instance" style={{ animationDelay: delay }}>
      <span className="hyperzoom__layer hyperzoom__layer--accent" />
      <span className="hyperzoom__layer hyperzoom__layer--gold" />
      <span className="hyperzoom__layer hyperzoom__layer--core" />
    </div>
  )
}

export default function LogoHyperzoom({ className = '' }) {
  return (
    <div className={`hyperzoom ${className}`} aria-hidden="true">
      {/* Le filtre de deformation vit dans un SVG de taille nulle : il
          n'est la que pour etre reference par la CSS. */}
      <svg className="hyperzoom__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter id="bde-hyperzoom-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.009 0.018"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="7s"
                values="0.009 0.018;0.016 0.010;0.009 0.018"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="22"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="hyperzoom__stage">
        <ZoomInstance delay="0s" />
        <ZoomInstance delay="-1.9s" />
      </div>

      {/* Masque le logo dans les coins pour qu'il naisse et meure dans le
          fond plutot que de heurter les bords du cadre. */}
      <div className="hyperzoom__vignette" />

      <img src={logoWhite} alt="" className="hyperzoom__preload" />
    </div>
  )
}
