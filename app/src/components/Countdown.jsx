import { useEffect, useState } from 'react'
import { getParisDateParts, horaireConnu } from '../lib/formatDate'

function parts(msLeft) {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  return {
    jours: Math.floor(total / 86400),
    heures: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    secondes: total % 60,
  }
}

// Écart en jours de calendrier (heure de Paris) entre aujourd'hui et la date.
function joursRestants(isoString) {
  const j = (p) => Date.UTC(p.year, p.month - 1, p.day)
  return Math.round((j(getParisDateParts(isoString)) - j(getParisDateParts(new Date().toISOString()))) / 86400000)
}

// Heure pas encore annoncée (starts_at à 00h00) : un décompte vers minuit
// serait faux, on donne seulement le jour.
function JourSeulement({ target }) {
  const n = joursRestants(target)
  if (n < 0) return null
  const texte = n === 0 ? "Aujourd'hui" : n === 1 ? 'Demain' : `Dans ${n} jours`
  return (
    <div className="border-2 border-ink bg-white px-3 py-2 text-center">
      <span className="masthead block text-3xl">{texte}</span>
      <span className="label mt-1 block text-[9.5px] text-fg-subtle">Heure communiquée prochainement</span>
    </div>
  )
}

// Compte à rebours vers une date. Isolé dans son propre composant pour que
// le tic de chaque seconde ne redessine que ces quatre cases, pas la page.
export default function Countdown({ target }) {
  if (!horaireConnu(target)) return <JourSeulement target={target} />
  return <Decompte target={target} />
}

function Decompte({ target }) {
  const targetMs = new Date(target).getTime()
  const [left, setLeft] = useState(() => targetMs - Date.now())

  useEffect(() => {
    const id = setInterval(() => setLeft(targetMs - Date.now()), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  if (!Number.isFinite(targetMs) || left <= 0) return null

  const { jours, heures, minutes, secondes } = parts(left)
  const cases = [
    [jours, 'jours'],
    [heures, 'h'],
    [minutes, 'min'],
    [secondes, 's'],
  ]

  return (
    <div className="grid grid-cols-4 border-l-2 border-t-2 border-ink" role="timer" aria-live="off">
      {cases.map(([valeur, unite]) => (
        <div key={unite} className="flex flex-col items-center border-b-2 border-r-2 border-ink bg-white py-2">
          <span className="masthead text-3xl tabular-nums">{String(valeur).padStart(2, '0')}</span>
          <span className="label mt-1 text-[9.5px] text-fg-subtle">{unite}</span>
        </div>
      ))}
    </div>
  )
}
