// Titre de section : un sur-titre en petites capitales orange, un filet
// court, puis le titre en gros. Remplace les <h2> nus, qui se noyaient
// dans la page une fois le reste du site enrichi.
export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2 className="mt-1.5 font-display text-2xl font-semibold leading-tight text-fg lg:text-3xl">
          {title}
        </h2>
      </div>
      {action}
    </div>
  )
}
