import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchPartnerById } from '../lib/partners'
import { metaPartenaire } from '../lib/seo'
import { useSeoDonnees } from '../hooks/useSeo'
import { isLogoFile } from '../lib/media'
import PartnerMiniMap from '../components/PartnerMiniMap'
import RichText from '../components/RichText'
import AddressLink from '../components/AddressLink'
import { nomAppCartes } from '../lib/maps'
import { tailleMasthead } from '../lib/masthead'

const SHELL = 'mx-auto w-full max-w-6xl px-5 lg:px-10'

function Info({ label, children }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b-2 border-ink py-3">
      <dt className="label pt-0.5 text-fg-subtle">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  )
}

// Libellé du bouton vers le site du partenaire : quand le lien mène à une
// billetterie, on le dit, plutôt qu'un « Voir le site » qui ne dit pas ce
// qu'on va y trouver.
function libelleSite(url) {
  if (url.includes('helloasso.com')) return 'Acheter un billet'
  if (/billetterie|ticket/i.test(url)) return 'Billetterie'
  return 'Site du partenaire'
}

function initiales(nom) {
  return nom
    .split(' ')
    .slice(0, 2)
    .map((mot) => mot[0])
    .join('')
    .toUpperCase()
}

export default function PartenaireDetailPage() {
  const { id } = useParams()
  const [partner, setPartner] = useState(null)
  const [status, setStatus] = useState('loading')
  useSeoDonnees(useMemo(() => metaPartenaire(partner), [partner]))
  // Un logo peut pointer vers un hôte injoignable (quota, hors ligne, URL
  // périmée) : on retombe sur les initiales plutôt que sur l'icône cassée.
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    setStatus('loading')
    fetchPartnerById(id)
      .then((data) => {
        setPartner(data)
        setStatus('ok')
      })
      .catch((err) => {
        console.error(err)
        setStatus('error')
      })
  }, [id])

  if (status === 'loading') {
    return (
      <main className={`${SHELL} pt-10`}>
        <p className="label text-fg-subtle">Chargement</p>
      </main>
    )
  }

  if (status === 'error' || !partner) {
    return (
      <main className={`${SHELL} pt-8`}>
        <Link to="/partenaires" className="label inline-block py-2 hover:bg-accent-gold">
          ← Partenaires
        </Link>
        <p className="alert mt-4">Ce partenaire est introuvable.</p>
      </main>
    )
  }

  const hasMap = partner.latitude && partner.longitude
  const showLogo = partner.logo_url && !logoFailed
  const logo = showLogo && isLogoFile(partner.logo_url)

  return (
    <main className={SHELL}>
      <div className="flex items-center justify-between border-b-2 border-ink py-3">
        <Link to="/partenaires" className="label px-1 py-1 transition hover:bg-accent-gold">
          ← Partenaires
        </Link>
        {partner.kind === 'partenaire' ? (
          <span className="tag" style={{ '--tag-bg': 'var(--color-accent)' }}>Partenaire officiel</span>
        ) : (
          <span className="tag">Bon plan</span>
        )}
      </div>

      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14 lg:pt-12">
        <div className="@container flex flex-col">
          <div className="flex items-center gap-5">
            <span
              className={`flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden border-2 border-ink lg:h-32 lg:w-32 ${
                logo ? 'bg-white p-3' : 'bg-surface'
              }`}
            >
              {showLogo ? (
                <img
                  src={partner.logo_url}
                  alt=""
                  className={`h-full w-full ${logo ? 'object-contain' : 'object-cover'}`}
                  onError={() => setLogoFailed(true)}
                />
              ) : (
                <span className="masthead text-3xl">{initiales(partner.name)}</span>
              )}
            </span>
            {partner.partner_categories && (
              <p className="label text-fg-subtle">{partner.partner_categories.name}</p>
            )}
          </div>

          <h1 className="masthead mt-6" style={{ fontSize: tailleMasthead(partner.name, { max: '6.5rem' }) }}>
            {partner.name}
          </h1>

          {/* Pas de mention générique du type « sur présentation de la
              carte étudiante » : les conditions varient d'un partenaire à
              l'autre, chaque fiche décrit les siennes dans sa description. */}
          <div className="mt-8 border-2 border-ink bg-accent-gold p-5 shadow-[5px_5px_0_var(--color-ink)]">
            <p className="label">Avantage étudiant</p>
            <p className="mt-2 font-display text-2xl uppercase leading-[0.95] lg:text-3xl">{partner.benefit}</p>
          </div>

          {partner.website_url && (
            <a
              href={partner.website_url}
              target="_blank"
              rel="noreferrer"
              className="btn mt-8 self-start"
            >
              {libelleSite(partner.website_url)}
              <span aria-hidden="true">↗</span>
            </a>
          )}
        </div>

        {(hasMap || partner.address || partner.phone) && (
          <div>
            {hasMap && <PartnerMiniMap latitude={partner.latitude} longitude={partner.longitude} />}
            <dl className={hasMap ? 'mt-6 border-t-2 border-ink' : 'border-t-2 border-ink'}>
              {(partner.address || hasMap) && (
                // Certains partenaires ont des coordonnées sans adresse
                // écrite (le Théâtre Dunois) : le lien passe alors par les
                // coordonnées.
                <Info label="Adresse">
                  <AddressLink
                    nom={partner.name}
                    adresse={partner.address}
                    lat={partner.latitude}
                    lon={partner.longitude}
                    className="group block"
                  >
                    <span className="underline decoration-2 underline-offset-4 transition group-hover:bg-accent-gold">
                      {partner.address || 'Voir sur la carte'}
                    </span>
                    <span className="label mt-1.5 block text-fg-subtle">Ouvrir dans {nomAppCartes()} ↗</span>
                  </AddressLink>
                </Info>
              )}
              {partner.phone && (
                <Info label="Téléphone">
                  <a
                    href={`tel:${partner.phone.replace(/\s+/g, '')}`}
                    className="underline decoration-2 underline-offset-4 transition hover:bg-accent-gold"
                  >
                    {partner.phone}
                  </a>
                </Info>
              )}
            </dl>
          </div>
        )}
      </div>

      {partner.description && (
        <section className="mt-12 grid gap-6 border-t-2 border-ink pt-8 lg:mt-16 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-14">
          <h2 className="label text-[12px]">Détails de l'offre</h2>
          <RichText text={partner.description} className="max-w-2xl text-[17px]" />
        </section>
      )}

      <div className="h-16 lg:h-24" />
    </main>
  )
}
