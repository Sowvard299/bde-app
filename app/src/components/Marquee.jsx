import { Fragment } from 'react'

// Bandeau de texte qui défile, repris de la couverture de la charte
// graphique. Le texte est répété assez de fois pour dépasser la largeur des
// plus grands écrans, puis posé deux fois : l'animation recule de la
// moitié exacte de la piste, ce qui boucle sans saut. `whitespace-pre`
// garde les espaces autour des barres, que le HTML fusionnerait sinon.
//
// `texte` est une chaîne, ou une liste de morceaux `{ texte, couleur }`
// quand chaque mot doit garder sa couleur (les séries sur l'accueil).
export default function Marquee({ texte, className = '' }) {
  const morceaux = typeof texte === 'string' ? [{ texte }] : texte
  const motif = Array.from({ length: 8 }, () => morceaux).flat()
  const piste = (
    <span className="masthead whitespace-pre px-3 py-2.5 text-xl lg:text-2xl">
      {motif.map((morceau, i) => (
        <Fragment key={i}>
          <span style={morceau.couleur ? { color: morceau.couleur } : undefined}>{morceau.texte}</span>
          {'   /   '}
        </Fragment>
      ))}
    </span>
  )

  return (
    <div className={`marquee border-y-2 border-ink ${className}`} aria-hidden="true">
      <div className="marquee__track">
        {piste}
        {piste}
      </div>
    </div>
  )
}
