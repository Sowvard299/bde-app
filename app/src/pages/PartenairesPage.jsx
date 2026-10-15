import PartenairesContent from '../components/PartenairesContent'
import PageHeader from '../components/PageHeader'
import QuestionsFrequentes from '../components/QuestionsFrequentes'
import { FAQ_PARTENAIRES } from '../lib/seo'

export default function PartenairesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-5 lg:px-10">
      <PageHeader
        title="Partenaires"
        intro="Les réductions négociées par le BDE autour de l'IAE et dans Paris. La carte étudiante suffit."
      />
      <PartenairesContent />
      <QuestionsFrequentes items={FAQ_PARTENAIRES} className="mt-14 pb-16 lg:pb-24" />
    </main>
  )
}
