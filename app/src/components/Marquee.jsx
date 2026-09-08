// Bandeau défilant, ancré au bas de l'affiche d'accueil comme un bandeau
// d'annonces. Le tableau d'items est rendu deux fois d'affilée et la piste
// se translate de -50% : quand l'animation boucle, la seconde copie est
// exactement à la place de la première, donc la couture ne se voit pas.
//
// Volontairement droit et compact : une version inclinée avait été essayée
// et lisait comme un autocollant posé de travers plutôt que comme un
// élément de la mise en page.
export default function Marquee({ items, className = '' }) {
  const sequence = [...items, ...items]

  return (
    <div className={`overflow-hidden bg-accent-gold py-2.5 ${className}`} aria-hidden="true">
      <div className="marquee-track flex w-max items-center">
        {sequence.map((item, index) => (
          <span key={`${item}-${index}`} className="flex shrink-0 items-center">
            <span className="px-4 text-xs font-bold uppercase tracking-[0.18em] text-ink">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-ink/40" />
          </span>
        ))}
      </div>
    </div>
  )
}
