import AppFooter from '../components/AppFooter'
import BarsContent from '../components/BarsContent'
import PageHeader from '../components/PageHeader'

export default function BarsPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-[1400px] lg:px-10 lg:pb-16 lg:pt-12">
      <PageHeader
        eyebrow="La carte des soirées"
        title="Bars de Paris"
        subtitle="193 adresses repérées par le BDE : les moins chères de la ville, et celles qui valent le détour pour ce qu'on y fait."
      />
      <BarsContent />
      <AppFooter />
    </main>
  )
}
