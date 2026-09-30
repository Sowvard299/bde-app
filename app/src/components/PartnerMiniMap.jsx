import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { partenaireIcon } from '../lib/leafletIcons'

export default function PartnerMiniMap({ latitude, longitude }) {
  return (
    <div className="carte-site border-2 border-ink">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        dragging={false}
        className="h-52 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={partenaireIcon} />
      </MapContainer>
    </div>
  )
}
