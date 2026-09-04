const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v']

export function isVideoUrl(url) {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))
}

const ASSET_BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

// Videos live on Cloudflare R2 instead of Supabase Storage — Supabase's free
// tier bandwidth (5.5GB/month) got blown through fast by a handful of
// 20-40MB clips on repeat views, and R2 has no egress fees at all.
export const R2_MEDIA_BASE = 'https://pub-d05e7299e5fd4b1dbe11ede3faa31bb3.r2.dev/'

export const WEICUP_EVENT_ID = '8e66e3b4-918d-4370-bc14-bcf52c86f0d6'

// Matched by id, not title — the display title is just teaser copy for now
// ("WEI — Édition ?") and shouldn't be relied on for detection.
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

// Faint background pictogram used to re-skin the WEI event detail page while
// no real logo exists yet (see WeiWordmark for the "logo" itself).
export const WEICUP_PICTOGRAM = ASSET_BASE + 'pictogramme%20wei%20beige%20sans%20fond.png'
