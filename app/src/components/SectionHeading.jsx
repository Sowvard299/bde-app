// Titre de section : le titre en capitales sur un trait plein, et à droite
// un lien éventuel (« Tout voir »).
export default function SectionHeading({ title, action }) {
  return (
    <div className="flex items-end justify-between gap-4 border-b-2 border-ink pb-3">
      <h2 className="masthead text-[clamp(2.25rem,9vw,4rem)]">{title}</h2>
      {action && <div className="shrink-0 pb-1">{action}</div>}
    </div>
  )
}
