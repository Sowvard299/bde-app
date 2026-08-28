import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../lib/leafletIcons'

const PARIS_CENTER = [48.8566, 2.3522]

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
        {located.map((partner) => (
          <Marker
            key={partner.id}
            position={[partner.latitude, partner.longitude]}
            eventHandlers={{ click: () => navigate(`/partenaires/${partner.id}`) }}
          >
            <Popup>
              <span className="font-semibold">{partner.name}</span>
              <br />
              {partner.benefit}
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
