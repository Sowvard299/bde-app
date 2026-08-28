import { Navigate, Route, Routes } from 'react-router-dom'
import PartenairesPage from './pages/PartenairesPage'
import PartenaireDetailPage from './pages/PartenaireDetailPage'
import EvenementsPage from './pages/EvenementsPage'
import EvenementDetailPage from './pages/EvenementDetailPage'
import MaCarteBdePage from './pages/MaCarteBdePage'
import MentionsLegalesPage from './pages/MentionsLegalesPage'
import ConfidentialitePage from './pages/ConfidentialitePage'
import BottomNav from './components/BottomNav'
import InstallBanner from './components/InstallBanner'
import PushOptInBanner from './components/PushOptInBanner'

function App() {
  return (
    <>
      <InstallBanner />
      <PushOptInBanner />
      <Routes>
        <Route path="/" element={<Navigate to="/evenements" replace />} />
        <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/evenements/:id" element={<EvenementDetailPage />} />
        <Route path="/partenaires" element={<PartenairesPage />} />
        <Route path="/partenaires/:id" element={<PartenaireDetailPage />} />
        <Route path="/carte-bde" element={<MaCarteBdePage />} />
        <Route path="/mentions-legales" element={<MentionsLegalesPage />} />
        <Route path="/confidentialite" element={<ConfidentialitePage />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default App
