import { tailleMasthead } from '../lib/masthead'

// En-tête des pages : le titre en très grand, une phrase d'introduction
// factuelle, et au besoin une donnée à droite (un compteur, une date de
// mise à jour). Pas de sur-titre décoratif au-dessus du titre.

export default function PageHeader({ title, intro, meta }) {
  return (
    <header className="@container border-b-2 border-ink pb-6 pt-8 lg:pb-10 lg:pt-14">
      <h1 className="masthead" style={{ fontSize: tailleMasthead(title, { max: '10rem' }) }}>
        {title}
      </h1>
      {(intro || meta) && (
        <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-3 lg:mt-7">
          {intro && <p className="max-w-xl text-base leading-relaxed text-fg-muted lg:text-lg">{intro}</p>}
          {meta && <p className="label text-fg-subtle">{meta}</p>}
        </div>
      )}
    </header>
  )
}
