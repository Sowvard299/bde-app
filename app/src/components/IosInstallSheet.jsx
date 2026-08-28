export default function IosInstallSheet({ onClose }) {
  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Comment installer l'application"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] rounded-t-2xl bg-surface p-6 pb-8 sm:max-w-xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-line" />
        <h2 className="font-display text-lg font-semibold text-fg">Installer l'application</h2>
        <ol className="mt-4 flex flex-col gap-4">
          <Step number={1}>
            Appuie sur l'icône <ShareIcon /> <strong>Partager</strong> dans la barre Safari
          </Step>
          <Step number={2}>
            Fais défiler et choisis <strong>"Sur l'écran d'accueil"</strong>
          </Step>
          <Step number={3}>
            Appuie sur <strong>"Ajouter"</strong> en haut à droite
          </Step>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-accent px-4 py-3 text-center text-sm font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Compris
        </button>
      </div>
    </div>
  )
}

function Step({ number, children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
        {number}
      </span>
      <p className="text-fg-muted">{children}</p>
    </li>
  )
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="inline-block align-text-bottom"
      aria-hidden="true"
    >
      <path d="M12 3v12" />
      <path d="M8 7l4-4 4 4" />
      <rect x="5" y="11" width="14" height="10" rx="2" />
    </svg>
  )
}
