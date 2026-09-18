import logoWhite from '../assets/logo-mark-white.png'

// Effet « hyperzoom chrome » : le blason, en metal poli, fonce vers l'ecran
// en boucle continue pendant que les reflets glissent sur sa surface.
//
// La reference (technoparade.fr) est un rendu 3D pre-calcule joue en video.
// Refait ici en direct dans le navigateur, pour deux raisons : cette app a
// un long passif de videos qui refusent de demarrer sur iOS, et une video
// ne s'adapte pas aux tailles d'ecran.
//
// Le chrome repose sur trois couches qui se completent :
//
//  1. Un degrade « rampe chrome » — bandes sombres et claires alternees,
//     transitions nettes — qui defile lentement en travers de la forme.
//     C'est ce glissement qui fait lire la surface comme du metal : un
//     reflet, contrairement a une couleur, bouge quand l'objet bouge.
//  2. Des transitions franches entre bandes. Un eclairage speculaire SVG
//     avait ete essaye d'abord : plus juste physiquement, mais il rendait
//     une surface laiteuse facon verre depoli, et surtout il coutait plus
//     d'une minute de calcul par image au rendu. Les aretes nettes d'un
//     degrade font lire le metal bien mieux, pour un cout nul.
//
// Le zoom infini repose sur deux exemplaires identiques decales d'une
// demi-duree : quand le premier disparait apres avoir depasse l'ecran, le
// second est deja a mi-parcours, donc la boucle ne montre jamais de couture.
function ZoomInstance({ delay }) {
  return (
    <div className="hyperzoom__instance" style={{ animationDelay: delay }}>
      <span className="hyperzoom__chrome" />
    </div>
  )
}

export default function LogoHyperzoom({ className = '' }) {
  return (
    <div className={`hyperzoom ${className}`} aria-hidden="true">
      {/* SVG de taille nulle : il n'existe que pour porter les filtres. */}
      <svg className="hyperzoom__defs" aria-hidden="true" focusable="false">
        <defs>
          {/* Deformation liquide, appliquee a l'ensemble de la scene. */}
          <filter id="bde-warp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.007 0.014"
              numOctaves="2"
              seed="7"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                dur="9s"
                values="0.007 0.014;0.013 0.008;0.007 0.014"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="16"
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

      <div className="hyperzoom__vignette" />

      <img src={logoWhite} alt="" className="hyperzoom__preload" />
    </div>
  )
}
