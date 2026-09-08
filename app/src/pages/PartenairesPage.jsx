import PartenairesContent from '../components/PartenairesContent'
import AppFooter from '../components/AppFooter'
import PageHeader from '../components/PageHeader'

export default function PartenairesPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <PageHeader
        eyebrow="Ta carte étudiante suffit"
        title="Partenaires & bons plans"
        subtitle="Les réductions négociées par le BDE, autour de l'IAE et partout dans Paris."
      />
      <PartenairesContent />
      <AppFooter />
    </main>
  )
}
