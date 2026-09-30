export default function IosInstallSheet({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label="Comment installer l'application"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[480px] border-2 border-b-0 border-ink bg-white p-6 pb-[calc(2rem+env(safe-area-inset-bottom))] sm:max-w-md sm:border-b-2 sm:mb-6 sm:shadow-[8px_8px_0_var(--color-ink)]"
      >
        <h2 className="masthead text-4xl">Installer sur iPhone</h2>
        <ol className="mt-5 border-t-2 border-ink">
          <Step number={1}>
            Touchez l'icône <ShareIcon /> Partager du navigateur.
          </Step>
          <Step number={2}>Faites défiler et choisissez « Sur l'écran d'accueil ».</Step>
          <Step number={3}>Touchez « Ajouter » en haut à droite.</Step>
        </ol>
        <button
          type="button"
          onClick={onClose}
          className="btn mt-6 w-full"
        >
          Compris
        </button>
      </div>
    </div>
  )
}

function Step({ number, children }) {
  return (
    <li className="flex items-start gap-4 border-b-2 border-ink py-3">
      <span className="masthead w-7 shrink-0 text-2xl">{String(number).padStart(2, '0')}</span>
      <p className="pt-0.5 text-fg-muted">{children}</p>
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
