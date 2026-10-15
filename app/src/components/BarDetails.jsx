import {
  flagsAffichables,
  formatEuro,
  tarifMaintenant,
} from '../lib/bars'
import { lienItineraire } from '../lib/maps'
import { suivre } from '../lib/mesure'

// Les lignes du tableau de prix, dans l'ordre où on se les demande : ce
// que coûte une bière d'abord, le reste ensuite. Une ligne sans valeur
// publiée disparaît : mieux vaut une fiche courte qu'une colonne de tirets.
const LIGNES_PRIX = [
  ['pinte_hh', 'Pinte en happy hour'],
  ['pinte_hors_hh', 'Pinte hors happy hour'],
  ['cocktail', 'Cocktail'],
  ['verre_vin', 'Verre de vin'],
  ['ticket_entree', "Entrée"],
  ['litre_meilleur', 'Le litre, au meilleur tarif'],
  ['tournee_20_pers', 'Tournée pour 20 personnes'],
]

const FOND_TARIF = {
  'happy-hour': '#8be3b0',
  constant: '#ffffff',
  'hors-creneau': '#ffffff',
  inconnu: '#ffffff',
}

const SANS_ALCOOL = {
  'oui-assume': 'Le lieu revendique une offre sans alcool.',
  'probable-activite': "L'activité se tient sans boire : le BDE le suppose, le lieu ne l'annonce pas.",
}

// Le contenu d'une fiche de bar : état tarifaire, prix, horaires, sur
// place, liens. Partagé par la fiche ouverte sur la carte (BarSheet) et
// par la page du bar (/bars/<nom>), pour qu'elles disent la même chose.
//
// `avecNotes` : les notes du relevé sont des notes de travail (« le moins
// cher du corpus », « à vérifier »). Elles restent sur la carte, mais pas
// sur les pages publiques indexées.
export default function BarDetails({ lieu, libelles, maintenant, maj, avecNotes = true }) {
  const tarif = tarifMaintenant(lieu, maintenant)
  const flags = flagsAffichables(lieu)
  const prix = LIGNES_PRIX.filter(([cle]) => lieu.prix[cle] != null)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="tag" style={{ '--tag-bg': FOND_TARIF[tarif.etat] }}>
          {tarif.libelle}
        </span>
        {lieu.metro && <span className="tag" style={{ '--tag-bg': '#fff' }}>M° {lieu.metro}</span>}
        <span className="tag" style={{ '--tag-bg': '#fff' }}>{lieu.arrondissement}</span>
      </div>

      {lieu.concept && <p className="leading-relaxed text-fg-muted">{lieu.concept}</p>}

      {lieu.bon_plan && (
        <p className="border-2 border-ink bg-accent-gold px-3.5 py-3 text-sm font-semibold">{lieu.bon_plan}</p>
      )}

      {prix.length > 0 && (
        <section>
          <h3 className="label mb-2">Prix</h3>
          <dl className="border-t-2 border-ink">
            {prix.map(([cle, label]) => (
              <div key={cle} className="flex items-baseline justify-between gap-3 border-b border-hairline py-2.5">
                <dt className="text-sm text-fg-muted">{label}</dt>
                <dd className="masthead text-xl">{formatEuro(lieu.prix[cle])}</dd>
              </div>
            ))}
          </dl>
          {lieu.prix.note_litre && <p className="mt-1.5 text-xs text-fg-subtle">{lieu.prix.note_litre}</p>}
        </section>
      )}

      {(lieu.horaires || lieu.happy_hour) && (
        <section className="flex flex-col gap-1">
          <h3 className="label mb-1">Horaires</h3>
          {lieu.horaires && <p className="text-sm text-fg-muted">{lieu.horaires}</p>}
          {lieu.happy_hour && <p className="text-sm text-fg-muted">{lieu.happy_hour}</p>}
          {lieu.hh?.remarque && <p className="text-xs text-fg-subtle">{lieu.hh.remarque}</p>}
        </section>
      )}

      {flags.length > 0 && (
        <section>
          <h3 className="label mb-2">Sur place</h3>
          <ul className="flex flex-wrap gap-1.5">
            {flags.map((flag) => (
              <li key={flag} className="border border-ink px-2 py-1 text-xs">
                {libelles[flag] ?? flag}
              </li>
            ))}
          </ul>
        </section>
      )}

      {avecNotes && lieu.notes && <p className="text-sm leading-relaxed text-fg-muted">{lieu.notes}</p>}

      {lieu.sans_alcool && SANS_ALCOOL[lieu.sans_alcool] && (
        <p className="text-xs text-fg-subtle">
          Sans alcool : {lieu.note_sans_alcool || SANS_ALCOOL[lieu.sans_alcool]}
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <a
          href={lienItineraire({ nom: lieu.nom, adresse: lieu.adresse, lat: lieu.lat, lon: lieu.lon })}
          target="_blank"
          rel="noreferrer"
          className="btn"
          onClick={() => suivre('clic_itineraire', { lieu: lieu.nom, type: 'bar' })}
        >
          Itinéraire
        </a>
        <a
          href={`https://www.google.com/search?q=${encodeURIComponent(`${lieu.nom} ${lieu.adresse}`)}`}
          target="_blank"
          rel="noreferrer"
          className="btn-ghost"
          onClick={() => suivre('clic_avis_bar', { lieu: lieu.nom })}
        >
          Avis
        </a>
      </div>

      {/* La date de relevé reste affichée : sans elle, un prix périmé
          passerait pour une promesse. L'avertissement sur l'alcool
          est une obligation légale. */}
      <p className="border-t-2 border-ink pt-3 text-[11px] leading-relaxed text-fg-subtle">
        Données du {maj} : prix pouvant avoir changé. L'abus d'alcool est dangereux pour la
        santé, à consommer avec modération.
      </p>
    </>
  )
}
