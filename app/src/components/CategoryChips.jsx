export default function CategoryChips({ categories, activeSlug, onSelect }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-wrap lg:px-0" role="group" aria-label="Filtrer par catégorie">
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
      className={`label shrink-0 border-2 border-ink px-3.5 py-2 text-[11px] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        active ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-accent-gold'
      }`}
    >
      {label}
    </button>
  )
}
