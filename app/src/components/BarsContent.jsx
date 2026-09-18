import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  FILTRES_VIDES,
  compterFiltresActifs,
  distanceKm,
  filtrerEtTrier,
  loadBars,
} from '../lib/bars'
import { useMediaQuery } from '../hooks/useMediaQuery'
import BarCard from './BarCard'
import BarSheet from './BarSheet'
import BarsFilters from './BarsFilters'
import BarsMap from './BarsMap'
import ViewToggle from './ViewToggle'

// Le seul état de la page qui vieillit tout seul, c'est l'heure : un
// happy hour qui se termine doit éteindre sa pastille verte sans qu'on
// recharge. Une minute suffit, et évite de recalculer 193 créneaux à
// chaque seconde.
function useHorloge(intervalleMs = 60000) {
  const [maintenant, setMaintenant] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setMaintenant(new Date()), intervalleMs)
    return () => clearInterval(id)
  }, [intervalleMs])

  return maintenant
}

export default function BarsContent() {
  const [donnees, setDonnees] = useState(null)
  const [erreur, setErreur] = useState(null)
  const [filtres, setFiltres] = useState(FILTRES_VIDES)
  const [vue, setVue] = useState('carte')
  const [position, setPosition] = useState(null)
  const [etatPosition, setEtatPosition] = useState('inactif')
  const maintenant = useHorloge()

  // La fiche ouverte vit dans l'URL : le bouton retour d'Android la ferme
  // au lieu de quitter la page, et un lien vers un bar se partage.
  const [params, setParams] = useSearchParams()
  const selectionId = params.get('lieu') ? Number(params.get('lieu')) : null

  // Seuil plus haut que le `lg` de Tailwind : a 1024 px la colonne de
  // navigation et la liste laissent moins de 300 px a la carte, ou plus
  // rien n'est lisible. En dessous, on bascule de l'une a l'autre.
  const grandEcran = useMediaQuery('(min-width: 1280px)')

  useEffect(() => {
    loadBars().then(setDonnees).catch(setErreur)
  }, [])

  const selectionner = useCallback(
    (id) => {
      setParams(
        (p) => {
          const suivant = new URLSearchParams(p)
          if (id == null) suivant.delete('lieu')
          else suivant.set('lieu', String(id))
          return suivant
        },
        { replace: false }
      )
    },
    [setParams]
  )

  const fermer = useCallback(() => selectionner(null), [selectionner])

  const demanderPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setEtatPosition('refuse')
      return
    }
    setEtatPosition('attente')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lon: pos.coords.longitude })
        setEtatPosition('ok')
        setFiltres((f) => ({ ...f, tri: 'distance' }))
      },
      () => setEtatPosition('refuse'),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    )
  }, [])

  // L'heure n'entre dans le calcul que si un filtre s'en sert. Sinon le
  // tic de la minute reconstruirait une liste identique, et avec elle les
  // 193 marqueurs de la carte — pour rien.
  const horlogeFiltre = filtres.meilleurPrix ? maintenant : null

  const resultats = useMemo(() => {
    if (!donnees) return []
    return filtrerEtTrier(donnees.lieux, filtres, {
      maintenant: horlogeFiltre ?? undefined,
      position,
    })
  }, [donnees, filtres, horlogeFiltre, position])

  // La carte ne veut que les lieux : lui passer les paires {lieu, km}
  // reconstruirait la couche de marqueurs à chaque tic d'horloge.
  const lieuxCarte = useMemo(() => resultats.map((r) => r.lieu), [resultats])

  // Cherché dans le jeu complet, pas dans les résultats filtrés : sinon
  // toucher un filtre pendant qu'une fiche est ouverte la ferait
  // disparaître sous les doigts.
  const selection = useMemo(() => {
    if (selectionId == null || !donnees) return null
    const lieu = donnees.lieux.find((l) => l.id === selectionId)
    if (!lieu) return null
    return {
      lieu,
      km: position ? distanceKm(position.lat, position.lon, lieu.lat, lieu.lon) : null,
    }
  }, [donnees, selectionId, position])

  const nbFiltresActifs = compterFiltresActifs(filtres)

  if (erreur) {
    return (
      <p className="rounded-xl bg-red-950 px-4 py-3 text-red-300">
        Impossible de charger la carte des bars. Vérifie ta connexion et réessaie.
      </p>
    )
  }

  if (!donnees) {
    return <p className="text-fg-faint">Chargement des adresses…</p>
  }

  const liste = (
    <div className="flex flex-col gap-2">
      {resultats.length === 0 ? (
        <p className="rounded-xl bg-surface px-4 py-6 text-center text-sm text-fg-faint">
          Aucune adresse ne correspond. Enlève un filtre pour élargir.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {resultats.map(({ lieu, km }) => (
            <BarCard
              key={lieu.id}
              lieu={lieu}
              km={km}
              actif={lieu.id === selectionId}
              onSelect={selectionner}
              maintenant={maintenant}
              libelles={donnees.libelles}
            />
          ))}
        </ul>
      )}
    </div>
  )

  const carte = (
    <BarsMap
      lieux={lieuxCarte}
      selectionId={selectionId}
      onSelect={selectionner}
      position={position}
    />
  )

  return (
    <div className="flex flex-col gap-5">
      <BarsFilters
        filtres={filtres}
        setFiltres={setFiltres}
        lieux={donnees.lieux}
        libelles={donnees.libelles}
        nbResultats={resultats.length}
        position={position}
        etatPosition={etatPosition}
        onDemanderPosition={demanderPosition}
        nbFiltresActifs={nbFiltresActifs}
        onReinitialiser={() => setFiltres(FILTRES_VIDES)}
      />

      {grandEcran ? (
        // Sur grand écran, carte et liste côte à côte : cliquer une carte
        // déplace la pastille correspondante sous les yeux, ce qui est
        // tout l'intérêt d'avoir les deux. La carte reste collée en haut
        // pendant qu'on fait défiler les 193 adresses.
        <div className="grid grid-cols-[minmax(0,1fr)_360px] gap-4">
          <div className="sticky top-6 h-[calc(100svh-8rem)]">{carte}</div>
          <div className="max-h-[calc(100svh-8rem)] overflow-y-auto pr-1">{liste}</div>
        </div>
      ) : (
        <>
          <ViewToggle
            options={[
              { value: 'carte', label: 'Carte' },
              { value: 'liste', label: 'Liste' },
            ]}
            value={vue}
            onChange={setVue}
          />
          {vue === 'carte' ? <div className="h-[62svh] min-h-80">{carte}</div> : liste}
        </>
      )}

      {selection && (
        <BarSheet
          lieu={selection.lieu}
          km={selection.km}
          onClose={fermer}
          libelles={donnees.libelles}
          maintenant={maintenant}
        />
      )}

      <p className="text-[11px] leading-relaxed text-fg-subtle">
        {donnees.lieux.length} adresses compilées par le BDE à partir de {donnees.sources.length}{' '}
        sources publiques, mises à jour le {donnees.maj.split('-').reverse().join('/')}.{' '}
        {donnees.avertissement_donnees}
      </p>
    </div>
  )
}
