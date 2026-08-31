const VIDEO_EXTENSIONS = ['.mp4', '.mov', '.webm', '.m4v']

export function isVideoUrl(url) {
  if (!url) return false
  const clean = url.split('?')[0].toLowerCase()
  return VIDEO_EXTENSIONS.some((ext) => clean.endsWith(ext))
}

// The WEICUP event currently reuses last year's WEI footage as a teaser —
// flag it so the UI can mark it with a small "*" note.
export function isReusedMedia(event) {
  return Boolean(event?.title?.includes('WEICUP'))
}

export function isWeicup(event) {
  return Boolean(event?.title?.includes('WEICUP'))
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

const ASSET_BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

// The WEICUP hero logo and the faint background pictogram used to re-skin
// its event detail page — swapped in instead of the DB's image_url/no
// per-event styling, since this is the only event with a dedicated look.
export const WEICUP_LOGO = ASSET_BASE + 'logo%20wei%20jaune%20et%20rouge.png'
export const WEICUP_PICTOGRAM = ASSET_BASE + 'pictogramme%20wei%20beige%20sans%20fond.png'
export const WEICUP_EVENT_ID = '8e66e3b4-918d-4370-bc14-bcf52c86f0d6'
