const WEICUP_LOGO =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/logo%20WEI%20CUP%202027.png'

const MILESTONES = [
  {
    title: 'WEICUP — Latino Edition',
    date: '25-27 septembre 2026',
    note: 'Prepararse...',
    href: 'https://weicup.netlify.app/',
    logo: WEICUP_LOGO,
  },
  { title: 'Pull de promo', date: 'Février / mars 2027' },
  { title: "Concours Inter-IAE d'éloquence", date: 'Mars 2027' },
  { title: 'Coupe de France des IAE', date: 'Avril 2027' },
  { title: 'Gala BDE', date: 'Mai 2027' },
]

export default function AnnualMilestones() {
  return (
    <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2">
      {MILESTONES.map((milestone) => {
        const Tag = milestone.href ? 'a' : 'div'
        return (
          <Tag
            key={milestone.title}
            {...(milestone.href
              ? { href: milestone.href, target: '_blank', rel: 'noreferrer' }
              : {})}
            className="flex w-40 shrink-0 snap-start flex-col justify-between gap-2 rounded-xl border border-line bg-surface p-3 transition hover:border-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {milestone.logo ? (
              <img src={milestone.logo} alt="" className="h-10 w-auto object-contain" />
            ) : null}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {milestone.date}
              </p>
              <p className="font-display text-sm font-semibold text-fg">{milestone.title}</p>
              {milestone.note && (
                <p className="mt-0.5 text-xs italic text-fg-faint">{milestone.note}</p>
              )}
            </div>
          </Tag>
        )
      })}
    </div>
  )
}
