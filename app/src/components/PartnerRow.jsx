function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export default function PartnerRow({ partner }) {
  return (
    <li>
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3 text-left transition hover:border-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {partner.logo_url ? (
          <img
            src={partner.logo_url}
            alt=""
            className="h-12 w-12 shrink-0 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-500">
            {initials(partner.name)}
          </span>
        )}

        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm text-neutral-500">{partner.name}</span>
          <span className="block truncate text-base font-bold text-accent">
            {partner.benefit}
          </span>
        </span>
      </button>
    </li>
  )
}
