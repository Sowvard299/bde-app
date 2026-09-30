// Bandeau de texte qui défile, repris de la couverture de la charte
// graphique. Le texte est répété assez de fois pour dépasser la largeur des
// plus grands écrans, puis posé deux fois : l'animation recule de la
// moitié exacte de la piste, ce qui boucle sans saut. `whitespace-pre`
// garde les espaces autour des barres, que le HTML fusionnerait sinon.
export default function Marquee({ texte, className = '' }) {
  const segment = Array.from({ length: 8 }, () => texte).join('   /   ')

  return (
    <div className={`marquee border-y-2 border-ink ${className}`} aria-hidden="true">
      <div className="marquee__track">
        <span className="masthead whitespace-pre px-3 py-2.5 text-xl lg:text-2xl">{segment}   /   </span>
        <span className="masthead whitespace-pre px-3 py-2.5 text-xl lg:text-2xl">{segment}   /   </span>
      </div>
    </div>
  )
}
