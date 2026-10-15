// Questions fréquentes, en clair sur la page : les mêmes textes que le
// balisage FAQPage et que le rendu serveur (lib/geo.js, lib/seo.js).
// Toutes ouvertes : une réponse repliée se lit mal, et un assistant qui
// cite la page doit trouver la même chose que le visiteur.
export default function QuestionsFrequentes({ items, titre = 'Questions fréquentes', className = '' }) {
  if (!items?.length) return null
  return (
    <section className={`border-t-2 border-ink pt-8 ${className}`}>
      <h2 className="masthead text-4xl lg:text-5xl">{titre}</h2>
      <dl className="mt-6 border-t-2 border-ink">
        {items.map(({ q, r }) => (
          <div key={q} className="grid gap-2 border-b-2 border-ink py-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10">
            <dt className="font-display text-2xl uppercase leading-[0.95]">{q}</dt>
            <dd className="max-w-2xl leading-relaxed text-fg-muted">{r}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
