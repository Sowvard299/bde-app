import { useEffect, useState } from 'react'
import { MAX_PHOTOS, envoyerSuggestion } from '../lib/barSuggestions'
import { useSheetComportement } from '../hooks/useSheetComportement'
import ViewToggle from './ViewToggle'

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  )
}

function CroixIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function CocheIcon() {
  return (
    <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

const champ =
  'w-full rounded-xl border border-line bg-surface px-4 py-3 text-base text-fg placeholder:text-fg-subtle focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

export default function ProposerBarSheet({ onClose }) {
  const fermerRef = useSheetComportement(onClose)

  const [type, setType] = useState('nouveau')
  const [nom, setNom] = useState('')
  const [adresse, setAdresse] = useState('')
  const [notes, setNotes] = useState('')
  const [contact, setContact] = useState('')
  const [piege, setPiege] = useState('')
  const [photos, setPhotos] = useState([]) // [{ fichier, apercu }]
  const [statut, setStatut] = useState('formulaire') // formulaire | envoi | succes | erreur
  const [erreur, setErreur] = useState('')

  // Les aperçus sont des URL d'objet : elles tiennent en mémoire tant
  // qu'on ne les libère pas explicitement, contrairement à une simple
  // référence qui disparaît avec le composant.
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.apercu)), [photos])

  const ajouterPhotos = (fichiersChoisis) => {
    const place = MAX_PHOTOS - photos.length
    const retenus = Array.from(fichiersChoisis).slice(0, place)
    setPhotos((p) => [...p, ...retenus.map((fichier) => ({ fichier, apercu: URL.createObjectURL(fichier) }))])
  }

  const retirerPhoto = (index) => {
    setPhotos((p) => {
      URL.revokeObjectURL(p[index].apercu)
      return p.filter((_, i) => i !== index)
    })
  }

  const adresseRequise = type === 'nouveau'
  // On demande au moins une preuve exploitable : une photo de la carte,
  // ou à défaut une note écrite. Un nom seul ne dit rien qu'on ne sache
  // déjà, et ne vaut pas la peine d'être relu.
  const preuveManquante = photos.length === 0 && notes.trim() === ''
  const pretAEnvoyer =
    nom.trim() !== '' && (!adresseRequise || adresse.trim() !== '') && !preuveManquante

  const soumettre = async (event) => {
    event.preventDefault()
    if (!pretAEnvoyer || statut === 'envoi') return

    setStatut('envoi')
    setErreur('')
    try {
      await envoyerSuggestion({
        type,
        nom,
        adresse,
        notes,
        contact,
        fichiers: photos.map((p) => p.fichier),
        piege,
      })
      setStatut('succes')
    } catch (err) {
      console.error('Envoi de la proposition impossible', err)
      setErreur("L'envoi n'a pas abouti. Vérifie ta connexion et réessaie.")
      setStatut('erreur')
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} role="presentation" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Proposer un bar"
        className="bar-sheet relative max-h-[92svh] w-full overflow-y-auto rounded-t-3xl border border-line bg-canvas pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-3xl sm:pb-6"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-canvas/95 px-5 pb-3 pt-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="font-display text-xl font-semibold text-fg">Proposer un bar</h2>
            <p className="mt-0.5 text-sm text-fg-faint">
              On relit chaque proposition avant de l'ajouter à la carte.
            </p>
          </div>
          <button
            ref={fermerRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 rounded-full border border-line bg-surface p-2 text-fg-muted transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {statut === 'succes' ? (
          <div className="flex flex-col items-center gap-3 px-5 py-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <CocheIcon />
            </span>
            <p className="font-display text-lg font-semibold text-fg">Merci, c'est envoyé</p>
            <p className="max-w-xs text-sm text-fg-faint">
              On regarde ça et on l'ajoute à la carte si c'est bon.
              {contact.trim() && ' On te dit un mot si tu nous as laissé ton mail.'}
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              Fermer
            </button>
          </div>
        ) : (
          <form onSubmit={soumettre} className="flex flex-col gap-5 px-5 pt-4">
            <ViewToggle
              options={[
                { value: 'nouveau', label: 'Nouveau bar' },
                { value: 'existant', label: 'Correction' },
              ]}
              value={type}
              onChange={setType}
            />

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-fg">
              Nom du bar
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={type === 'nouveau' ? 'Le nom tel qu\'il est affiché' : 'Le nom déjà sur la carte'}
                required
                className={champ}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-fg">
              Adresse{!adresseRequise && <span className="font-normal text-fg-subtle"> (si tu l'as)</span>}
              <input
                type="text"
                value={adresse}
                onChange={(e) => setAdresse(e.target.value)}
                placeholder="Numéro et rue, arrondissement"
                required={adresseRequise}
                className={champ}
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm font-semibold text-fg">
                Photo de la carte
                <span className="font-normal text-fg-subtle"> (jusqu'à {MAX_PHOTOS})</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                  <div key={p.apercu} className="group relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
                    <img src={p.apercu} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => retirerPhoto(i)}
                      aria-label="Retirer cette photo"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                    >
                      <CroixIcon />
                    </button>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-fg-subtle transition hover:border-fg-subtle hover:text-fg-faint">
                    <CameraIcon />
                    <span className="text-[10px] font-semibold">Ajouter</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      multiple
                      onChange={(e) => {
                        ajouterPhotos(e.target.files)
                        e.target.value = ''
                      }}
                      className="sr-only"
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-fg">
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  type === 'nouveau'
                    ? "Ce qui vaut le coup : prix, happy hour, ambiance…"
                    : 'Ce qui a changé : prix, horaires, adresse…'
                }
                rows={3}
                className={`${champ} resize-none`}
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-fg">
              Ton email <span className="font-normal text-fg-subtle">(facultatif)</span>
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Pour te dire merci si on l'ajoute"
                className={champ}
              />
            </label>

            {/* Piège à robots : un champ vide pour un humain, tentant pour
                un script qui remplit tout ce qu'il trouve. Caché à
                l'écran ET au lecteur d'écran — `sr-only` l'aurait laissé
                visible à un visiteur non-voyant, qui l'aurait alors
                rempli et déjoué le piège sans le vouloir. */}
            <input
              type="text"
              name="site"
              value={piege}
              onChange={(e) => setPiege(e.target.value)}
              tabIndex={-1}
              aria-hidden="true"
              autoComplete="off"
              style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}
            />

            {erreur && <p className="text-sm text-red-400">{erreur}</p>}

            <button
              type="submit"
              disabled={!pretAEnvoyer || statut === 'envoi'}
              className="rounded-full bg-accent px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {statut === 'envoi' ? 'Envoi…' : 'Envoyer'}
            </button>

            {preuveManquante && (
              <p className="-mt-3 text-xs text-fg-subtle">
                Ajoute une photo de la carte ou une note pour que la proposition soit exploitable.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
