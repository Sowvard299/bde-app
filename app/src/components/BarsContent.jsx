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
import ProposerBarSheet from './ProposerBarSheet'
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
  const proposerOuvert = params.get('proposer') === '1'

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

  // Même logique que la fiche d'un bar : vivre dans l'URL fait fermer le
  // formulaire avec le bouton retour du téléphone plutôt que de quitter
  // la page, et permet de partager un lien qui l'ouvre directement.
  const ouvrirProposition = useCallback(() => {
    setParams((p) => {
      const suivant = new URLSearchParams(p)
      suivant.set('proposer', '1')
      return suivant
    })
  }, [setParams])

  const fermerProposition = useCallback(() => {
    setParams((p) => {
      const suivant = new URLSearchParams(p)
      suivant.delete('proposer')
      return suivant
    })
  }, [setParams])

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
  // « 2026-09-19 » se lit « 19/09/2026 ».
  const dateMaj = donnees?.maj.split('-').reverse().join('/')

  if (erreur) {
    return (
      <p className="alert">Impossible de charger la carte des bars. Vérifiez la connexion et réessayez.</p>
    )
  }

  if (!donnees) {
    return <p className="label text-fg-subtle">Chargement des adresses</p>
  }

  const liste = (
    <div>
      {resultats.length === 0 ? (
        <p className="border-2 border-dashed border-ink px-4 py-8 text-center text-sm text-fg-muted">
          Aucune adresse ne correspond. Retirez un filtre pour élargir la recherche.
        </p>
      ) : (
        <ul className="border-t-2 border-ink">
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
        <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-6">
          <div className="sticky top-24 h-[calc(100svh-8rem)]">{carte}</div>
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
          maj={dateMaj}
        />
      )}

      {/* Une seule entrée, en bas de page plutôt qu'un bouton flottant
          sur la carte ou dans la barre de filtres : la liste doit rester
          concentrée sur ses 193 adresses, pas sur la façon d'en ajouter
          une. */}
      <div className="flex flex-col items-start justify-between gap-4 border-2 border-ink bg-surface p-5 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-2xl uppercase leading-none">Une adresse manque</p>
          <p className="mt-1.5 text-sm text-fg-muted">
            Proposez un bar ou mettez à jour les prix d'un bar existant, photo de la carte à l'appui.
          </p>
        </div>
        <button type="button" onClick={ouvrirProposition} className="btn shrink-0">
          Proposer un bar
        </button>
      </div>

      {proposerOuvert && <ProposerBarSheet onClose={fermerProposition} />}

      <p className="text-xs leading-relaxed text-fg-subtle">
        {donnees.lieux.length} adresses. Données du {dateMaj} : prix pouvant avoir changé.{' '}
        {donnees.avertissement}
      </p>
    </div>
  )
}
