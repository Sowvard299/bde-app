import { useEffect, useState } from 'react'

function parts(msLeft) {
  const total = Math.max(0, Math.floor(msLeft / 1000))
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

function Cell({ value, label }) {
  return (
    <div className="flex min-w-[52px] flex-col items-center rounded-xl bg-white/10 px-2 py-2 backdrop-blur-sm">
      <span className="font-display text-2xl font-bold leading-none tabular-nums text-white">
        {String(value).padStart(2, '0')}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
        {label}
      </span>
    </div>
  )
}

// Compte à rebours vers une date. Isolé dans son propre composant pour que
// le tic de chaque seconde ne re-rende que ces quatre cases, et pas toute
// la page d'accueil autour.
export default function Countdown({ target }) {
  const targetMs = new Date(target).getTime()
  const [left, setLeft] = useState(() => targetMs - Date.now())

  useEffect(() => {
    const id = setInterval(() => setLeft(targetMs - Date.now()), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  if (!Number.isFinite(targetMs) || left <= 0) return null

  const { days, hours, minutes, seconds } = parts(left)

  return (
    <div className="flex gap-2" role="timer" aria-live="off">
      <Cell value={days} label="jours" />
      <Cell value={hours} label="h" />
      <Cell value={minutes} label="min" />
      <Cell value={seconds} label="sec" />
    </div>
  )
}
