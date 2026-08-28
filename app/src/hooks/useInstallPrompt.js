import { useEffect, useState } from 'react'

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)

  useEffect(() => {
    function handleBeforeInstallPrompt(event) {
      event.preventDefault()
      setDeferredPrompt(event)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  return { canInstall: Boolean(deferredPrompt), promptInstall }
}
