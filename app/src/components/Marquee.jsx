// Bandeau défilant façon affiche de festival. Le tableau d'items est rendu
// deux fois d'affilée et la piste se translate de -50% : quand l'animation
// boucle, la seconde copie est exactement à la place de la première, donc
// la couture ne se voit pas.
//
// La légère rotation donne le côté sérigraphie. Elle est compensée par un
// scale-110 et un overflow-hidden sur le parent, sinon les coins tournés
// laisseraient apparaître deux triangles de fond.
export default function Marquee({ items, className = '' }) {
  const sequence = [...items, ...items]

  return (
    <div className={`relative overflow-hidden py-3 ${className}`} aria-hidden="true">
      <div className="-rotate-2 scale-110 bg-accent-gold py-2.5">
        <div className="marquee-track flex w-max items-center gap-6">
          {sequence.map((item, index) => (
            <span key={`${item}-${index}`} className="flex shrink-0 items-center gap-6">
              <span className="font-display text-lg font-bold uppercase tracking-wide text-ink">
                {item}
              </span>
              <span className="text-lg text-ink/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
