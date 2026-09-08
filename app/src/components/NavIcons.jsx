// Icônes de navigation, partagées par la barre du bas (mobile) et la
// colonne latérale (desktop). Dessinées à la main plutôt qu'importées :
// trois glyphes ne justifient pas une dépendance.
const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export function HomeIcon({ size = 22 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5.5 9.5V20a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}

export function CalendarIcon({ size = 22 }) {
  return (
    <svg {...base} width={size} height={size}>
      <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
      <path d="M3.5 10h17M8 3.5v3M16 3.5v3" />
    </svg>
  )
}

export function TagIcon({ size = 22 }) {
  return (
    <svg {...base} width={size} height={size}>
      <path d="M3.5 12.5V5a1.5 1.5 0 0 1 1.5-1.5h7.5L21 12l-8.5 8.5z" />
      <circle cx="8" cy="8" r="1.4" />
    </svg>
  )
}
