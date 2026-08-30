import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { bdeIcon } from '../lib/leafletIcons'

const PARIS_CENTER = [48.8566, 2.3522]

// IAE Paris Sorbonne — Rue Ponscarme, 75013 Paris.
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
    <div className="relative h-[60svh] min-h-80 w-full overflow-hidden rounded-2xl">
      <MapContainer center={PARIS_CENTER} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={SCHOOL.position} icon={bdeIcon}>
          <Popup>
            <span className="font-semibold">{SCHOOL.name}</span>
          </Popup>
        </Marker>

        {located.map((partner) => (
          <Marker key={partner.id} position={[partner.latitude, partner.longitude]}>
            <Popup>
              <div className="flex flex-col gap-1">
                <span className="font-semibold">{partner.name}</span>
                <span>{partner.benefit}</span>
                <button
                  type="button"
                  onClick={() => navigate(`/partenaires/${partner.id}`)}
                  className="mt-1 self-start rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white"
                >
                  Voir la fiche
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {located.length === 0 && (
        <p className="pointer-events-none absolute inset-x-4 top-4 z-[500] rounded-lg bg-white px-4 py-3 text-center text-neutral-500 shadow">
          Aucun partenaire à afficher sur la carte pour l'instant
        </p>
      )}
    </div>
  )
}
