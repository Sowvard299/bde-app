import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { bdeIcon, bonPlanIcon, partenaireIcon } from '../lib/leafletIcons'
import AddressLink from './AddressLink'

// IAE Paris Sorbonne, rue Ponscarme, 75013 Paris.
const SCHOOL = {
  name: 'IAE Paris Sorbonne',
  position: [48.8266031, 2.367821],
}

export default function PartnersMap({ partners }) {
  const navigate = useNavigate()

  const located = useMemo(
    () => partners.filter((p) => p.latitude != null && p.longitude != null),
    [partners]
  )

  return (
    <div className="carte-site relative h-[60svh] min-h-80 w-full border-2 border-ink">
      <MapContainer center={SCHOOL.position} zoom={15} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={SCHOOL.position} icon={bdeIcon}>
          <Popup>
            <span className="font-semibold">{SCHOOL.name}</span>
          </Popup>
        </Marker>

        {located.map((partner) => {
          const isPartenaire = partner.kind === 'partenaire'
          return (
            <Marker
              key={partner.id}
              position={[partner.latitude, partner.longitude]}
              icon={isPartenaire ? partenaireIcon : bonPlanIcon}
            >
              <Popup>
                <div className="flex flex-col gap-1.5">
                  <span
                    className="tag self-start"
                    style={{ '--tag-bg': isPartenaire ? 'var(--color-accent)' : 'var(--color-accent-gold)' }}
                  >
                    {isPartenaire ? 'Partenaire' : 'Bon plan'}
                  </span>
                  <span className="font-display text-lg uppercase leading-none">{partner.name}</span>
                  <span>{partner.benefit}</span>
                  {partner.address && (
                    <AddressLink
                      nom={partner.name}
                      adresse={partner.address}
                      lat={partner.latitude}
                      lon={partner.longitude}
                      className="text-xs underline underline-offset-2"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(`/partenaires/${partner.id}`)}
                    className="label mt-1 self-start bg-ink px-3 py-2 text-white"
                  >
                    Voir la fiche
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex gap-2">
        <span className="tag" style={{ '--tag-bg': 'var(--color-accent)' }}>Partenaire</span>
        <span className="tag">Bon plan</span>
      </div>

      {located.length === 0 && (
        <p className="pointer-events-none absolute inset-x-4 top-4 z-[500] border-2 border-ink bg-white px-4 py-3 text-center text-fg-muted">
          Aucun partenaire à afficher sur la carte pour le moment.
        </p>
      )}
    </div>
  )
}
