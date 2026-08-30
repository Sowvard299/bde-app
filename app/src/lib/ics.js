function toIcsDate(isoString) {
  return new Date(isoString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeText(text) {
  return String(text).replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')
}

function getEventTimes(event) {
  const start = toIcsDate(event.starts_at)
  const end = event.ends_at
    ? toIcsDate(event.ends_at)
    : toIcsDate(new Date(new Date(event.starts_at).getTime() + 2 * 60 * 60 * 1000).toISOString())
  return { start, end }
}

function getEventLocation(event) {
  return [event.location_name, event.location_address].filter(Boolean).join(', ')
}

function buildIcs(event) {
  const { start, end } = getEventTimes(event)
  const stamp = toIcsDate(new Date().toISOString())

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//BDE IAE Paris Sorbonne//FR',
    'BEGIN:VEVENT',
    `UID:${event.id}@bde-iae-paris-sorbonne`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeText(event.title)}`,
  ]

  const location = getEventLocation(event)
  if (location) {
    lines.push(`LOCATION:${escapeText(location)}`)
  }

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeText(event.description)}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

// On mobile (iOS Safari en tete), naviguer directement vers une data: URI
// declenche l'ouverture native de l'appli Calendrier / la fiche "Ajouter
// l'evenement", au lieu d'un simple telechargement de fichier .ics.
// Sur desktop, le navigateur telecharge le fichier, que Calendrier (macOS)
// ou Outlook peuvent ensuite importer normalement.
export function downloadEventIcs(event) {
  const content = buildIcs(event)
  const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`
  window.location.href = dataUrl
}

export function buildGoogleCalendarUrl(event) {
  const { start, end } = getEventTimes(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
  })

  const location = getEventLocation(event)
  if (location) params.set('location', location)
  if (event.description) params.set('details', event.description)

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}
