// Sélecteur de vue (Liste / Carte, Liste / Calendrier) : deux cases
// accolées dans un même cadre, la vue active en plein.
export default function ViewToggle({ options, value, onChange }) {
  return (
    <div className="flex w-full border-2 border-ink sm:w-fit" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`label flex-1 border-r-2 border-ink px-5 py-3 text-[12px] transition last:border-r-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-accent sm:flex-none ${
            value === option.value ? 'bg-ink text-white' : 'bg-white text-ink hover:bg-accent-gold'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
