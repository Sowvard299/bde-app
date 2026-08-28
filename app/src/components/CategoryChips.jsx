export default function CategoryChips({ categories, activeSlug, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer par catégorie">
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
          : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
      }`}
    >
      {label}
    </button>
  )
}
