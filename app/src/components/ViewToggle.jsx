export default function ViewToggle({ options, value, onChange }) {
  return (
    <div className="flex gap-1 rounded-full bg-surface p-1 sm:w-fit" role="tablist">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            value === option.value ? 'bg-surface-muted text-fg shadow-sm' : 'text-fg-faint'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}
