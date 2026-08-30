export function isIosSafari() {
  const ua = window.navigator.userAgent
  const isIos = /iPad|iPhone|iPod/.test(ua) && !window.MSStream
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(ua)
  return isIos && isSafari
}

export function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  )
}

// Phone or tablet, as opposed to a desktop/laptop. iPadOS 13+ reports a
// desktop Safari user agent, so we also treat a touch-capable "Macintosh"
// as a tablet.
export function isMobileOrTablet() {
  const ua = window.navigator.userAgent
  if (/iPad|iPhone|iPod|Android|Mobile|Tablet|Silk|Kindle/i.test(ua)) return true
  const isIpadOs = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1
  return isIpadOs
}
