import { Link } from 'react-router-dom'
import { ASSOCIATION } from '../lib/seo'
import AddressLink from './AddressLink'
import Marquee from './Marquee'
import PhenixChrome from './PhenixChrome'
import { RUBRIQUES } from './SiteHeader'

// Pied de page commun à toutes les pages : le bandeau de la charte, puis
// un bloc bleu nuit avec le nom en grand et les informations de
// l'association. Rendu une seule fois, par App, plutôt que recopié au bas
// de chaque page.
export default function AppFooter() {
  const annee = new Date().getFullYear()

  return (
    <footer className="mt-20 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:mt-28 lg:pb-0">
      <Marquee texte="IAE Paris Sorbonne" className="bg-accent-gold text-ink" />

      <div className="bg-ink text-white">
        <div className="mx-auto max-w-6xl px-5 pb-10 pt-12 lg:px-10 lg:pb-14 lg:pt-16">
          <div className="flex items-end gap-4">
            <PhenixChrome className="h-20 w-20 lg:h-32 lg:w-32" />
            <p className="masthead text-[13vw] leading-[0.82] sm:text-6xl lg:text-8xl">
              BDE IAE
              <br />
              Paris Sorbonne
            </p>
          </div>

          <div className="mt-12 grid gap-10 border-t-2 border-white/25 pt-8 sm:grid-cols-3">
            <div>
              <p className="label text-accent-gold">Rubriques</p>
              <ul className="mt-3 flex flex-col gap-2">
                {[{ to: '/accueil', label: 'Accueil' }, ...RUBRIQUES].map((r) => (
                  <li key={r.to}>
                    <Link to={r.to} className="text-white/85 transition hover:text-accent-gold">
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="label text-accent-gold">Association</p>
              <ul className="mt-3 flex flex-col gap-2 text-white/85">
                <li>{ASSOCIATION.nomLegal}</li>
                <li>
                  <AddressLink
                    adresse={`${ASSOCIATION.adresse}, ${ASSOCIATION.codePostal} ${ASSOCIATION.ville}`}
                    className="transition hover:text-accent-gold"
                  />
                </li>
                <li>
                  <a
                    href={`mailto:${ASSOCIATION.email}`}
                    className="transition hover:text-accent-gold"
                  >
                    {ASSOCIATION.email}
                  </a>
                </li>
                <li>
                  <a
                    href={ASSOCIATION.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="transition hover:text-accent-gold"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="label text-accent-gold">Informations</p>
              <ul className="mt-3 flex flex-col gap-2">
                <li>
                  <Link to="/mentions-legales" className="text-white/85 transition hover:text-accent-gold">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link to="/confidentialite" className="text-white/85 transition hover:text-accent-gold">
                    Confidentialité
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <p className="mt-12 text-xs text-white/55">
            © {annee} {ASSOCIATION.nomLegal}, association loi 1901.
          </p>
        </div>
      </div>
    </footer>
  )
}
