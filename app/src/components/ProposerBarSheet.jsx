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

const champ = 'field'
const libelle = 'label flex flex-col gap-2'

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
      setErreur("L'envoi n'a pas abouti. Vérifiez la connexion et réessayez.")
      setStatut('erreur')
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} role="presentation" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Proposer un bar"
        className="bar-sheet relative max-h-[92svh] w-full overflow-y-auto border-2 border-ink bg-white pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:pb-6 sm:shadow-[8px_8px_0_var(--color-ink)]"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b-2 border-ink bg-white px-5 pb-4 pt-4">
          <div className="min-w-0">
            <h2 className="masthead text-4xl">Proposer un bar</h2>
            <p className="mt-2 text-sm text-fg-muted">
              Chaque proposition est relue par le BDE avant d'apparaître sur la carte.
            </p>
          </div>
          <button
            ref={fermerRef}
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="shrink-0 border-2 border-ink bg-white p-2 text-ink transition hover:bg-ink hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {statut === 'succes' ? (
          <div className="flex flex-col items-start gap-3 px-5 py-8">
            <span className="tag sticker" style={{ '--tag-bg': '#8be3b0' }}>Envoyé</span>
            <p className="masthead mt-2 text-3xl">Merci</p>
            <p className="max-w-sm text-fg-muted">
              La proposition sera relue puis ajoutée à la carte si les informations sont vérifiées.
              {contact.trim() && " Vous recevrez un message à l'adresse indiquée."}
            </p>
            <button type="button" onClick={onClose} className="btn mt-3">
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

            <label className={libelle}>
              Nom du bar
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder={type === 'nouveau' ? 'Nom affiché sur la devanture' : "Nom tel qu'il apparaît sur la carte"}
                required
                className={champ}
              />
            </label>

            <label className={libelle}>
              Adresse{!adresseRequise && <span className="font-normal normal-case tracking-normal text-fg-subtle"> (si connue)</span>}
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
              <p className="label">
                Photo de la carte
                <span className="font-normal normal-case tracking-normal text-fg-subtle"> (jusqu'à {MAX_PHOTOS})</span>
              </p>

              <div className="flex flex-wrap gap-2">
                {photos.map((p, i) => (
                  <div key={p.apercu} className="group relative h-20 w-20 shrink-0 overflow-hidden border-2 border-ink">
                    <img src={p.apercu} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => retirerPhoto(i)}
                      aria-label="Retirer cette photo"
                      className="absolute right-0 top-0 flex h-6 w-6 items-center justify-center bg-ink text-white transition hover:bg-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-white"
                    >
                      <CroixIcon />
                    </button>
                  </div>
                ))}

                {photos.length < MAX_PHOTOS && (
                  <label className="flex h-20 w-20 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 border-2 border-dashed border-ink text-ink transition hover:bg-accent-gold">
                    <CameraIcon />
                    <span className="label text-[10px]">Ajouter</span>
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

            <label className={libelle}>
              Notes
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  type === 'nouveau'
                    ? 'Prix, happy hour, ambiance'
                    : 'Ce qui a changé : prix, horaires, adresse'
                }
                rows={3}
                className={`${champ} resize-none`}
              />
            </label>

            <label className={libelle}>
              Email <span className="font-normal normal-case tracking-normal text-fg-subtle">(facultatif)</span>
              <input
                type="email"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Pour être prévenu de l'ajout"
                className={champ}
              />
            </label>

            {/* Piège à robots : un champ vide pour un humain, tentant pour
                un script qui remplit tout ce qu'il trouve. Caché à
                l'écran et au lecteur d'écran : `sr-only` l'aurait laissé
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

            {erreur && <p className="alert">{erreur}</p>}

            <button
              type="submit"
              disabled={!pretAEnvoyer || statut === 'envoi'}
              className="btn w-full"
            >
              {statut === 'envoi' ? 'Envoi en cours' : 'Envoyer'}
            </button>

            {preuveManquante && (
              <p className="-mt-3 text-xs text-fg-subtle">
                Ajoutez une photo de la carte ou une note pour que la proposition soit exploitable.
              </p>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
