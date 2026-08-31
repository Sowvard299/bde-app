export default function CategoryChips({ categories, activeSlug, onSelect }) {
  return (
    <div className="relative">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filtrer par catégorie"
      >
        <Chip label="Toutes" active={activeSlug === null} onClick={() => onSelect(null)} />
        {categories.map((category) => (
          <Chip
            key={category.id}
            label={category.name}
            active={activeSlug === category.slug}
            onClick={() => onSelect(category.slug)}
          />
        ))}
      </div>
      {/* Hints that the chip row scrolls further — easy to miss otherwise. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-canvas to-transparent" />
    </div>
  )
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active
          ? 'border-accent bg-accent text-white'
          : 'border-line bg-surface text-fg-muted hover:border-fg-subtle'
      }`}
    >
      {label}
    </button>
  )
}
