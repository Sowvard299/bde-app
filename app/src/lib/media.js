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
