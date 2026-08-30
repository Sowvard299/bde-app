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

const ASSET_BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

// The WEICUP hero logo and the faint background pictogram used to re-skin
// its event detail page — swapped in instead of the DB's image_url/no
// per-event styling, since this is the only event with a dedicated look.
export const WEICUP_LOGO = ASSET_BASE + 'logo%20wei%20jaune%20et%20rouge.png'
export const WEICUP_PICTOGRAM = ASSET_BASE + 'pictogramme%20wei%20beige%20sans%20fond.png'
