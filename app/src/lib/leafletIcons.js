import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import logoWhite from '../assets/logo-mark-white.png'

// Leaflet's default marker icon paths don't survive Vite's bundling.
// Re-point them at the bundled asset URLs so markers don't vanish.
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// A distinct pin for the school itself, with the BDE mark on it — set apart
// from the plain default pins used for partners.
export const bdeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 40px; height: 40px;
      display: flex; align-items: center; justify-content: center;
      background: #0f1564;
      border: 3px solid #fff;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    ">
      <img src="${logoWhite}" alt="" style="width: 20px; height: 20px; transform: rotate(45deg);" />
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
})
