import BarsContent from '../components/BarsContent'
import PageHeader from '../components/PageHeader'

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
    </main>
  )
}
