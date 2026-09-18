import { useEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { IAE, TYPES, formatEuro, prixRepere, tarifMaintenant } from '../lib/bars'
import { iconeAmas, iconeIae, iconePosition, iconePourLieu } from '../lib/barIcons'
import logoWhite from '../assets/logo-mark-white.png'

const CENTRE_PARIS = [48.8566, 2.3522]

function echapper(texte) {
  return String(texte).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]
  )
}

// Aperçu au survol : juste de quoi décider si on clique. Le reste de la
// fiche vit dans le panneau de détail, pas dans une infobulle.
function infobulle(lieu) {
  const prix = prixRepere(lieu)
  const tarif = tarifMaintenant(lieu)
  const ligne = prix ? `${formatEuro(prix.valeur)} ${prix.libelle}` : lieu.concept || lieu.adresse

  return `<strong>${echapper(lieu.nom)}</strong><br>${echapper(ligne)}${
    tarif.etat === 'happy-hour' ? '<br><em>Happy hour en cours</em>' : ''
  }`
}

// Couche des 193 pastilles, gérée à la main plutôt qu'avec les <Marker>
// de react-leaflet : le regroupement en amas vient d'un plugin Leaflet
// classique, qui veut ses marqueurs en direct. Poser deux couches l'une
// sur l'autre ferait clignoter les pastilles à chaque filtre.
function CoucheLieux({ lieux, selectionId, onSelect }) {
  const map = useMap()
  const groupeRef = useRef(null)
  const marqueursRef = useRef(new Map())
  // Gardé dans une ref : le clic d'un marqueur doit appeler le gestionnaire
  // courant sans qu'on ait à reconstruire toute la couche à chaque rendu.
  const onSelectRef = useRef(onSelect)
  useEffect(() => {
    onSelectRef.current = onSelect
  }, [onSelect])

  useEffect(() => {
    const groupe = L.markerClusterGroup({
      iconCreateFunction: iconeAmas,
      showCoverageOnHover: false,
      maxClusterRadius: 48,
      // Au dernier niveau de zoom on veut les adresses exactes, pas un
      // amas de plus : deux bars de la même rue sont deux choix distincts.
      disableClusteringAtZoom: 17,
      spiderfyOnMaxZoom: false,
    })
    groupeRef.current = groupe
    map.addLayer(groupe)

    return () => {
      map.removeLayer(groupe)
      groupeRef.current = null
    }
  }, [map])

  useEffect(() => {
    const groupe = groupeRef.current
    if (!groupe) return

    groupe.clearLayers()
    marqueursRef.current = new Map()

    const marqueurs = lieux.map((lieu) => {
      const marqueur = L.marker([lieu.lat, lieu.lon], {
        icon: iconePourLieu(lieu.type),
        // Lu par l'icône d'amas pour colorer son anneau selon ce qu'il
        // contient.
        barType: lieu.type,
        keyboard: false,
      })
      marqueur.bindTooltip(infobulle(lieu), { direction: 'top', offset: [0, -12] })
      marqueur.on('click', () => onSelectRef.current(lieu.id))
      marqueursRef.current.set(lieu.id, marqueur)
      return marqueur
    })

    groupe.addLayers(marqueurs)
  }, [lieux])

  // La pastille sélectionnée grossit et passe au-dessus des autres : sans
  // ça, cliquer une carte de la liste ne se voit pas sur la carte.
  useEffect(() => {
    const marqueurs = marqueursRef.current
    const lieu = lieux.find((l) => l.id === selectionId)

    marqueurs.forEach((marqueur, id) => {
      const type = marqueur.options.barType
      marqueur.setIcon(iconePourLieu(type, id === selectionId))
      marqueur.setZIndexOffset(id === selectionId ? 1000 : 0)
    })

    if (!lieu) return

    const marqueur = marqueurs.get(lieu.id)
    const groupe = groupeRef.current
    // Le marqueur peut être caché dans un amas : on demande au plugin de
    // l'exposer, sinon on survole du vide.
    if (groupe && marqueur) groupe.zoomToShowLayer(marqueur, () => {})
    map.flyTo([lieu.lat, lieu.lon], Math.max(map.getZoom(), 16), { duration: 0.6 })
  }, [selectionId, lieux, map])

  return null
}

function bornes(lieux) {
  return L.latLngBounds(lieux.map((l) => [l.lat, l.lon]))
}

export default function BarsMap({ lieux, selectionId, onSelect, position }) {
  // L'instance Leaflet arrive en etat, pas en ref : react-leaflet ne la
  // publie qu'au rendu suivant sa creation, donc une ref serait encore
  // vide au premier effet — et le garde-fou du cadrage initial ci-dessous
  // ne se poserait jamais, ce qui recadrait la carte a chaque filtre.
  const [map, setMap] = useState(null)
  const iaeIcon = useMemo(() => iconeIae(logoWhite), [])
  const cadrageInitial = useRef(false)

  useEffect(() => {
    if (!map || lieux.length === 0) return

    // Premier affichage : un zoom fixe cadre bien sur un ecran large et
    // coupe la moitie de Paris sur un telephone en portrait. On cadre
    // donc sur les adresses elles-memes.
    if (!cadrageInitial.current) {
      cadrageInitial.current = true
      map.fitBounds(bornes(lieux), { padding: [28, 28] })
      return
    }

    // Ensuite la vue appartient a qui la manipule — sauf si un filtre
    // vient de vider l'ecran. Rester sur une carte sans une seule
    // pastille laisserait croire que la recherche n'a rien donne alors
    // que les resultats sont juste ailleurs dans Paris.
    if (lieux.some((l) => map.getBounds().contains([l.lat, l.lon]))) return
    map.flyToBounds(bornes(lieux), { padding: [48, 48], maxZoom: 16, duration: 0.6 })
  }, [map, lieux])

  // Cadrer sur les resultats reste un geste volontaire : une carte qui
  // bouge toute seule pendant qu'on lit ses pastilles est perdue d'avance.
  const ajusterVue = () => {
    if (!map || lieux.length === 0) return
    map.flyToBounds(bornes(lieux), { padding: [48, 48], maxZoom: 16, duration: 0.6 })
  }

  return (
    <div className="bars-map relative h-full w-full overflow-hidden rounded-2xl border border-line">
      <MapContainer
        center={CENTRE_PARIS}
        zoom={12}
        minZoom={11}
        scrollWheelZoom
        className="h-full w-full"
        ref={setMap}
      >
        {/* Les tuiles sont celles d'OpenStreetMap, comme sur la carte des
            partenaires : c'est la seule source vraiment libre et sans clé
            d'API. Elles sont claires, et sur un fond clair les pastilles
            dorées et orange se noient dans les rues jaunes du rendu par
            défaut — on les retourne donc en CSS (voir .bars-map dans
            index.css) plutôt que de dépendre d'un fournisseur de fond
            sombre qui peut fermer son robinet du jour au lendemain. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[IAE.lat, IAE.lon]} icon={iaeIcon} zIndexOffset={500} />

        {position && <Marker position={[position.lat, position.lon]} icon={iconePosition} />}

        <CoucheLieux lieux={lieux} selectionId={selectionId} onSelect={onSelect} />
      </MapContainer>

      {/* Legende en bas a gauche, cadrage en haut a droite : cote a cote
          en bas, les deux passaient a la ligne sur telephone et venaient
          recouvrir l'attribution d'OpenStreetMap. */}
      <ul className="absolute bottom-3 left-3 z-[500] flex gap-3 rounded-full border border-white/10 bg-canvas/85 px-3 py-1.5 text-[11px] font-semibold text-fg-muted backdrop-blur">
        {Object.values(TYPES).map((t) => (
          <li key={t.cle} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: t.couleur }}
              aria-hidden="true"
            />
            {t.libelle}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={ajusterVue}
        className="absolute right-3 top-3 z-[500] rounded-full border border-white/10 bg-canvas/85 px-3 py-1.5 text-[11px] font-semibold text-fg-muted backdrop-blur transition hover:text-fg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Cadrer sur les résultats
      </button>

      {lieux.length === 0 && (
        <p className="pointer-events-none absolute inset-x-6 top-16 z-[500] rounded-xl border border-line bg-canvas/95 px-4 py-3 text-center text-sm text-fg-faint backdrop-blur">
          Aucun lieu ne correspond à ces filtres
        </p>
      )}
    </div>
  )
}
