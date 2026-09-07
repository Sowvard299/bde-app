import weicupLogo from '../assets/weicup-logo.png'

const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v']

export function isVideoUrl(url) {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))
}

// Videos live on Cloudflare R2 instead of Supabase Storage — Supabase's free
// tier bandwidth (5.5GB/month) got blown through fast by a handful of
// 20-40MB clips on repeat views, and R2 has no egress fees at all.
export const R2_MEDIA_BASE = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/'

export const WEICUP_EVENT_ID = '8e66e3b4-918d-4370-bc14-bcf52c86f0d6'

// Matched by id, not title, so this keeps working regardless of title text.
export function isWeicup(event) {
  return event?.id === WEICUP_EVENT_ID
}

// The WEI event currently reuses last year's footage as a teaser — flag it
// so the UI can mark it with a small "*" note.
export function isReusedMedia(event) {
  return isWeicup(event)
}

// Vector/wide "wordmark" logos (transparent background, not a square photo
// crop) need to be shown whole via object-contain on a neutral background —
// object-cover would crop them illegibly. Photo-style avatars (jpg/jpeg/webp)
// are fine cropped into a circle as-is.
export function isLogoFile(url) {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return clean.endsWith('.svg') || clean.endsWith('.png')
}

// Bundled with the app rather than served from Supabase Storage: the WEI is
// the one page that absolutely has to render even if the backend is down.
export const WEICUP_LOGO = weicupLogo

// Canonical ticketing link, kept in code rather than in the database so the
// most business-critical link on the site can't be wrong or unreachable.
export const WEICUP_TICKET_URL =
  'https://www.helloasso.com/associations/nouveau-bureau-des-etudiants-de-l-institut-d-administration-des-entreprises-de-paris/evenements/weicup-edition-latino-billetterie-wei-iae-paris-sorbonne-2026'

// Mise en vente des places WEI : dimanche 6 septembre 2026, 12h00 (Paris).
// Partagé par la page evenement et la frise d'accueil pour qu'elles basculent
// exactement au meme moment, sans intervention manuelle.
export const WEICUP_SALE_OPENS_AT = new Date('2026-09-06T12:00:00+02:00')

export function weicupSaleIsLive() {
  return Date.now() >= WEICUP_SALE_OPENS_AT.getTime()
}
