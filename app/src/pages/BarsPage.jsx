import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BarsContent from '../components/BarsContent'
import PageHeader from '../components/PageHeader'
import { loadBars } from '../lib/bars'
import { indexBars } from '../lib/barsSeo'

// Un lien par arrondissement : pour qui cherche « bar pas cher Paris 11e »,
// et pour que Google découvre les pages d'arrondissement et de bar.
function ParArrondissement() {
  const [groupes, setGroupes] = useState([])
  useEffect(() => {
    loadBars()
      .then((d) => setGroupes(indexBars(d.lieux).arrondissements.filter((a) => a.aSaPage)))
      .catch(() => {})
  }, [])
  if (!groupes.length) return null
  return (
    <section className="mt-14 border-t-2 border-ink pt-8">
      <h2 className="label text-[12px]">Bars par arrondissement</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {groupes.map((a) => (
          <li key={a.slug}>
            <Link to={`/bars/${a.slug}`} className="tag transition hover:bg-accent-gold" style={{ '--tag-bg': '#fff' }}>
              {a.libelle} · {a.lieux.length}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function BarsPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] px-5 pb-16 lg:px-10 lg:pb-24">
      <PageHeader
        title="Bars"
        intro="Les bars les moins chers de Paris et ceux qui valent le détour pour ce qu'on y fait. Carte, filtres par arrondissement, prix et happy hour."
      />
      <div className="pt-6 lg:pt-8">
        <BarsContent />
      </div>
      <ParArrondissement />
    </main>
  )
}
