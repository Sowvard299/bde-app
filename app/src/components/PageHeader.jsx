// En-tête des pages de liste. Un halo orange discret derrière le titre
// suffit à raccrocher ces pages à l'affiche d'accueil, sans reprendre tout
// son décorum (qui écraserait le contenu utile juste en dessous).
export default function PageHeader({ eyebrow, title, subtitle }) {
  return (
    <header className="relative">
      <div
        className="aurora aurora-slow -left-10 -top-16 h-40 w-56 opacity-40"
        style={{ background: 'radial-gradient(circle, #ff4214 0%, transparent 70%)' }}
      />
      <div className="relative">
        {eyebrow && (
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
            <span className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1.5 font-display text-3xl font-semibold leading-tight text-fg lg:text-4xl">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-fg-faint">{subtitle}</p>}
      </div>
    </header>
  )
}
