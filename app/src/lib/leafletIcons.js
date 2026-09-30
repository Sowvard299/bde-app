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

const ENCRE = '#0f1564'

// L'école : un carré bleu nuit avec l'écusson du BDE, ombre franche comme
// le reste du site.
export const bdeIcon = L.divIcon({
  className: '',
  html: `
    <div style="
      width: 38px; height: 38px;
      display: flex; align-items: center; justify-content: center;
      background: ${ENCRE};
      border: 2px solid ${ENCRE};
      box-shadow: 3px 3px 0 #ffc300;
    ">
      <img src="${logoWhite}" alt="" style="width: 22px; height: 22px;" />
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
})

// Épingle carrée : un aplat de couleur cerclé d'encre, posé sur une petite
// pointe pour marquer l'adresse exacte.
export function makePinIcon(color) {
  return L.divIcon({
    className: '',
    html: `
      <div style="position: relative; width: 24px; height: 30px;">
        <div style="
          width: 24px; height: 24px;
          background: ${color};
          border: 2px solid ${ENCRE};
          box-shadow: 2px 2px 0 ${ENCRE};
        "></div>
        <div style="
          position: absolute; left: 10px; top: 24px;
          width: 2px; height: 6px; background: ${ENCRE};
        "></div>
      </div>
    `,
    iconSize: [24, 30],
    iconAnchor: [11, 30],
    popupAnchor: [0, -30],
  })
}

// Partenaires (accord officiel) et bons plans (adresses repérées par le
// BDE), distingués par la couleur, comme dans la liste.
export const partenaireIcon = makePinIcon('#ff4214')
export const bonPlanIcon = makePinIcon('#ffc300')
export const simpleIcon = makePinIcon('#ffffff')
