import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AccueilPage from './pages/AccueilPage'
import BottomNav from './components/BottomNav'
import Sidebar from './components/Sidebar'
import WelcomeSheet from './components/WelcomeSheet'
import StandalonePushPrompt from './components/StandalonePushPrompt'
import InAppBrowserNotice from './components/InAppBrowserNotice'
import IntroSplash from './components/IntroSplash'
import { useSeoRoute } from './hooks/useSeo'

// Tout le site partait dans un seul fichier de 213 Ko compressés, Leaflet
// et le client Supabase compris — chargés même par quelqu'un qui ouvre
// l'accueil et repart. Chaque page est donc découpée, sauf l'accueil :
// c'est la première page de la plupart des visites, la découper
// n'ajouterait qu'un aller-retour réseau avant le premier affichage.
//
// Les morceaux sont précachés par le service worker après la première
// visite : la navigation reste instantanée une fois l'app installée.
const EvenementsPage = lazy(() => import('./pages/EvenementsPage'))
const EvenementDetailPage = lazy(() => import('./pages/EvenementDetailPage'))
const PartenairesPage = lazy(() => import('./pages/PartenairesPage'))
const PartenaireDetailPage = lazy(() => import('./pages/PartenaireDetailPage'))
const BarsPage = lazy(() => import('./pages/BarsPage'))
const AProposPage = lazy(() => import('./pages/AProposPage'))
const MentionsLegalesPage = lazy(() => import('./pages/MentionsLegalesPage'))
const ConfidentialitePage = lazy(() => import('./pages/ConfidentialitePage'))
const IntrouvablePage = lazy(() => import('./pages/IntrouvablePage'))

// Volontairement sobre : un morceau de page arrive en quelques dizaines de
// millisecondes, et un vrai squelette animé passerait son temps à
// clignoter pour rien.
function EnChargement() {
  return (
    <main className="mx-auto w-full max-w-[480px] px-4 pt-10 sm:max-w-xl lg:max-w-6xl lg:px-10">
      <p className="text-fg-faint">Chargement…</p>
    </main>
  )
}

function App() {
  useSeoRoute()

  return (
    <div className="lg:flex">
      <Sidebar />
      <div className="min-w-0 flex-1">
        <IntroSplash />
        <InAppBrowserNotice />
        <WelcomeSheet />
        <StandalonePushPrompt />
        <Suspense fallback={<EnChargement />}>
          <Routes>
            <Route path="/" element={<Navigate to="/accueil" replace />} />
            <Route path="/accueil" element={<AccueilPage />} />
            <Route path="/evenements" element={<EvenementsPage />} />
            <Route path="/evenements/:id" element={<EvenementDetailPage />} />
            <Route path="/partenaires" element={<PartenairesPage />} />
            <Route path="/partenaires/:id" element={<PartenaireDetailPage />} />
            <Route path="/bars" element={<BarsPage />} />
            <Route path="/a-propos" element={<AProposPage />} />
            <Route path="/carte-bde" element={<Navigate to="/partenaires" replace />} />
            <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
            <Route path="/confidentialite" element={<ConfidentialitePage />} />
            {/* Sans cette route, une adresse inconnue n'affichait rien :
                une page blanche sous la barre de navigation. */}
            <Route path="*" element={<IntrouvablePage />} />
          </Routes>
        </Suspense>
      </div>
      <BottomNav />
    </div>
  )
}

export default App
