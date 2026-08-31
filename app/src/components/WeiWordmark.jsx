// Stand-in "logo" for the WEI teaser period — no real logo yet, so just a
// fun handwritten mark instead of leaving an empty box. Swap this out once
// the real branding for the edition is revealed.
export default function WeiWordmark({ className = 'text-6xl' }) {
  return (
    <span
      className={`inline-block -rotate-6 select-none ${className}`}
      style={{ fontFamily: 'var(--font-handwritten)', color: 'var(--color-accent-pink)' }}
    >
      WEI
    </span>
  )
}
