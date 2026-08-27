import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'

function App() {
  const [status, setStatus] = useState('checking')
  const [categoryCount, setCategoryCount] = useState(0)

  useEffect(() => {
    supabase
      .from('partner_categories')
      .select('*', { count: 'exact', head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error(error)
          setStatus('error')
          return
        }
        setCategoryCount(count ?? 0)
        setStatus('ok')
      })
  }, [])

  return (
    <main className="mx-auto flex min-h-svh max-w-[390px] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold text-neutral-900">BDE — squelette du projet</h1>

      {status === 'checking' && (
        <p className="text-neutral-500">Connexion à Supabase…</p>
      )}

      {status === 'ok' && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-emerald-700">
          Connecté à Supabase — {categoryCount} catégorie(s) de partenaires trouvée(s).
        </p>
      )}

      {status === 'error' && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-red-700">
          Impossible de contacter Supabase. Vérifie les variables d'environnement.
        </p>
      )}
    </main>
  )
}

export default App
