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

function Cell({ value, label, cellClassName, valueClassName, labelClassName }) {
  return (
    <div className={cellClassName}>
      <span className={valueClassName}>{String(value).padStart(2, '0')}</span>
      <span className={labelClassName}>{label}</span>
    </div>
  )
}

const DEFAULT_CLASSES = {
  cell: 'flex min-w-[52px] flex-col items-center rounded-xl bg-white/10 px-2 py-2 backdrop-blur-sm',
  value: 'font-display text-2xl font-bold leading-none tabular-nums text-white',
  label: 'mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60',
}

// Compte à rebours vers une date. Isolé dans son propre composant pour que
// le tic de chaque seconde ne re-rende que ces quatre cases, et pas toute
// la page d'accueil autour.
//
// `classes` permet à un événement avec sa propre charte (le WEI, rouge et
// jaune plutôt que la charte générique du site) d'imposer ses couleurs sans
// dupliquer tout le composant.
export default function Countdown({ target, classes }) {
  const targetMs = new Date(target).getTime()
  const [left, setLeft] = useState(() => targetMs - Date.now())
  const c = { ...DEFAULT_CLASSES, ...classes }

  useEffect(() => {
    const id = setInterval(() => setLeft(targetMs - Date.now()), 1000)
    return () => clearInterval(id)
  }, [targetMs])

  if (!Number.isFinite(targetMs) || left <= 0) return null

  const { days, hours, minutes, seconds } = parts(left)

  return (
    <div className="flex gap-2" role="timer" aria-live="off">
      <Cell value={days} label="jours" cellClassName={c.cell} valueClassName={c.value} labelClassName={c.label} />
      <Cell value={hours} label="h" cellClassName={c.cell} valueClassName={c.value} labelClassName={c.label} />
      <Cell value={minutes} label="min" cellClassName={c.cell} valueClassName={c.value} labelClassName={c.label} />
      <Cell value={seconds} label="sec" cellClassName={c.cell} valueClassName={c.value} labelClassName={c.label} />
    </div>
  )
}
