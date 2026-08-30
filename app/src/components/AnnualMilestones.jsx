import { useEffect, useRef } from 'react'
import EventMedia from './EventMedia'

const BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

const MILESTONES = [
  {
    title: 'WEICUP — Latino Edition',
    date: '25-27 septembre 2026',
    note: 'Place bientôt disponible',
    media: BASE + 'logo%20WEI%20CUP%202027.png',
    isLogo: true,
  },
  {
    title: 'Pull de promo',
    date: 'Février / mars 2027',
    media: BASE + 'video%20coloris%20pulls%20bde%202026.mp4',
  },
  {
    title: "Concours Inter-IAE d'éloquence",
    date: 'Mars 2027',
    media: BASE + "Logoconcours%20d%27eloquence.jpeg",
    isLogo: true,
  },
  {
    title: 'Coupe de France des IAE',
    date: 'Avril 2027',
    media: BASE + 'CDF%20recap%202024%20carrousel%20.mp4',
  },
  {
    title: 'Gala BDE',
    date: 'Mai 2027',
    media: BASE + 'GALA.mp4',
  },
]

const PIXELS_PER_SECOND = 28
const PAUSE_AFTER_MANUAL_MS = 2500

export default function AnnualMilestones() {
  const scrollRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let rafId
    let lastTime = null

    function step(time) {
      if (lastTime === null) lastTime = time
      const dt = time - lastTime
      lastTime = time

      if (!pausedRef.current) {
        const maxScroll = el.scrollWidth - el.clientWidth
        if (maxScroll > 0) {
          const next = el.scrollLeft + (PIXELS_PER_SECOND * dt) / 1000
          el.scrollLeft = next >= maxScroll ? 0 : next
        }
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  function pauseAutoScroll() {
    pausedRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false
    }, PAUSE_AFTER_MANUAL_MS)
  }

  return (
    <div
      ref={scrollRef}
      onPointerDown={pauseAutoScroll}
      onWheel={pauseAutoScroll}
      className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2"
    >
      {MILESTONES.map((milestone) => {
        const Tag = milestone.href ? 'a' : 'div'
        return (
          <Tag
            key={milestone.title}
            {...(milestone.href
              ? { href: milestone.href, target: '_blank', rel: 'noreferrer' }
              : {})}
            className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl bg-ink p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <p className="text-xs font-bold uppercase italic tracking-wide text-accent">
              {milestone.date}
            </p>

            {milestone.isLogo ? (
              <div className="flex aspect-square w-full items-center justify-center rounded-xl bg-white p-6">
                <EventMedia src={milestone.media} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <EventMedia src={milestone.media} className="h-full w-full object-cover" />
              </div>
            )}

            <p className="font-display text-base font-bold uppercase leading-tight text-white">
              {milestone.title}
            </p>
            {milestone.note && (
              <p className="-mt-1 text-sm italic text-white/60">{milestone.note}</p>
            )}
          </Tag>
        )
      })}
    </div>
  )
}
