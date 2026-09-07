import { R2_MEDIA_BASE, WEICUP_EVENT_ID, WEICUP_TICKET_URL } from './media'

// Last-resort copy of the events the app cannot afford to lose: if Supabase
// is unreachable (outage, exceeded quota, offline device), the pages still
// render from here instead of showing an error. Media points at R2 and
// bundled assets, so nothing here depends on Supabase either.
export const FALLBACK_EVENTS = [
  {
    id: WEICUP_EVENT_ID,
    title: 'WEICUP — Latino Edition',
    description:
      "Le week-end d'intégration du BDE, édition Latino ! Toutes les infos sur la WEICUP.",
    starts_at: '2026-09-25T19:00:00+02:00',
    ends_at: '2026-09-27T18:00:00+02:00',
    image_url: R2_MEDIA_BASE + 'wei.mov',
    ticket_url: WEICUP_TICKET_URL,
    location_name: null,
    location_address: null,
    is_published: true,
  },
]

export function fallbackEventById(id) {
  return FALLBACK_EVENTS.find((event) => event.id === id) ?? null
}

export function fallbackUpcomingEvents() {
  const now = Date.now()
  return FALLBACK_EVENTS.filter((event) => new Date(event.starts_at).getTime() >= now)
}
