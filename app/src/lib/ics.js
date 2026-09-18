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

function slugify(title) {
  return (
    title
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'evenement'
  )
}

// Deux mecanismes bien differents selon la plateforme, parce qu'aucun des
// deux ne marche partout :
//
// - iOS (Safari comme la PWA installee sur l'ecran d'accueil) ignore le
//   telechargement d'un blob via <a download> : ca se contente d'ouvrir le
//   contenu texte brut dans l'onglet au lieu de proposer l'ajout au
//   calendrier. La seule methode fiable est une data: URI text/calendar,
//   mais il faut l'ouvrir avec window.open plutot que window.location.href
//   — depuis une PWA en mode standalone, une navigation same-page vers une
//   data: URI ne declenche rien, alors qu'un window.open relaie l'ouverture
//   a Safari, qui gere alors correctement la fiche "Ajouter l'evenement".
//
// - Partout ailleurs (Android, desktop), Chrome bloque la navigation
//   top-level vers une data: URI (ecran "adresse non valide"), mais un
//   blob: telecharge via un <a download> fonctionne normalement.
export function downloadEventIcs(event) {
  const content = buildIcs(event)
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream

  if (isIos) {
    const dataUrl = `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`
    window.open(dataUrl, '_blank')
    return
  }

  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${slugify(event.title)}.ics`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
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
