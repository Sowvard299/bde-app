import { Navigate, Route, Routes } from 'react-router-dom'
import PartenairesPage from './pages/PartenairesPage'
import PartenaireDetailPage from './pages/PartenaireDetailPage'
import EvenementsPage from './pages/EvenementsPage'
import EvenementDetailPage from './pages/EvenementDetailPage'
import MaCarteBdePage from './pages/MaCarteBdePage'
import BottomNav from './components/BottomNav'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/evenements" replace />} />
        <Route path="/evenements" element={<EvenementsPage />} />
        <Route path="/evenements/:id" element={<EvenementDetailPage />} />
        <Route path="/partenaires" element={<PartenairesPage />} />
        <Route path="/partenaires/:id" element={<PartenaireDetailPage />} />
        <Route path="/carte-bde" element={<MaCarteBdePage />} />
      </Routes>
      <BottomNav />
    </>
  )
}

export default App
