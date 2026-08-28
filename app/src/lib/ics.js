function toIcsDate(isoString) {
  return new Date(isoString).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
}

function escapeText(text) {
  return String(text).replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')
}

function buildIcs(event) {
  const start = toIcsDate(event.starts_at)
  const end = event.ends_at
    ? toIcsDate(event.ends_at)
    : toIcsDate(new Date(new Date(event.starts_at).getTime() + 2 * 60 * 60 * 1000).toISOString())
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

  if (event.location_name || event.location_address) {
    const location = [event.location_name, event.location_address].filter(Boolean).join(', ')
    lines.push(`LOCATION:${escapeText(location)}`)
  }

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeText(event.description)}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')

  return lines.join('\r\n')
}

export function downloadEventIcs(event) {
  const content = buildIcs(event)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `${event.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
