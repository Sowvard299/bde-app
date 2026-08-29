import PartenairesContent from '../components/PartenairesContent'
import AppFooter from '../components/AppFooter'

export default function PartenairesPage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[480px] flex-col gap-4 px-4 pb-24 pt-6 sm:max-w-xl lg:max-w-6xl lg:px-10 lg:pb-16 lg:pt-12">
      <h1 className="font-display text-2xl font-semibold text-fg lg:text-3xl">Partenaires</h1>
      <PartenairesContent />
      <AppFooter />
    </main>
  )
}
