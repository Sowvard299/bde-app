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
