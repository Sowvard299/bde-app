import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../lib/leafletIcons'
import { fetchCategories, fetchPartners } from '../lib/partners'
import CategoryChips from '../components/CategoryChips'

const PARIS_CENTER = [48.8566, 2.3522]

export default function CartePage() {
  const [partners, setPartners] = useState(null)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [activeSlug, setActiveSlug] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([fetchPartners(), fetchCategories()])
      .then(([partnersData, categoriesData]) => {
        setPartners(partnersData)
        setCategories(categoriesData)
      })
      .catch((err) => {
        console.error(err)
        setError(err)
      })
  }, [])

  const located = useMemo(
    () => (partners ?? []).filter((p) => p.latitude != null && p.longitude != null),
    [partners]
  )

  const filtered = useMemo(
    () =>
      activeSlug === null
        ? located
        : located.filter((p) => p.partner_categories?.slug === activeSlug),
    [located, activeSlug]
  )

  return (
    <main className="relative flex h-svh flex-col">
      <div className="z-[500] flex flex-col gap-3 bg-white px-4 pb-3 pt-6">
        <h1 className="font-display text-2xl font-semibold text-ink">Carte</h1>
        {categories.length > 0 && (
          <CategoryChips categories={categories} activeSlug={activeSlug} onSelect={setActiveSlug} />
        )}
      </div>

      {error && (
        <p className="mx-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Impossible de charger la carte. Réessaie plus tard.
        </p>
      )}

      <div className="relative flex-1 pb-16">
        <MapContainer center={PARIS_CENTER} zoom={13} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((partner) => (
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

        {!error && partners !== null && filtered.length === 0 && (
          <p className="pointer-events-none absolute inset-x-4 top-4 z-[500] rounded-lg bg-white px-4 py-3 text-center text-neutral-500 shadow">
            Aucun partenaire à afficher sur la carte pour l'instant
          </p>
        )}
      </div>
    </main>
  )
}
