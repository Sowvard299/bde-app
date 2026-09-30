import PartenairesContent from '../components/PartenairesContent'
import PageHeader from '../components/PageHeader'

export default function PartenairesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 lg:px-10">
      <PageHeader
        title="Partenaires"
        intro="Les réductions négociées par le BDE autour de l'IAE et dans Paris. La carte étudiante suffit."
      />
      <PartenairesContent />
    </main>
  )
}
