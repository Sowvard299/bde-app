// Les chiffres clés du relevé des bars, chacun avec ce qu'il mesure.
export default function ChiffresCles({ items }) {
  if (!items?.length) return null
  return (
    <section aria-label="Chiffres clés" className="mt-14 border-t-2 border-ink pt-8">
      <h2 className="label text-[12px]">En chiffres</h2>
      <ul className="mt-4 grid grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-3">
        {items.map(({ valeur, libelle }) => (
          <li key={libelle} className="flex flex-col gap-1 border-b-2 border-r-2 border-ink p-4">
            <span className="masthead text-4xl tabular-nums lg:text-5xl">{valeur}</span>
            <span className="text-sm leading-snug text-fg-muted">{libelle}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
