import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import EventMedia from './EventMedia'
import WeiWordmark from './WeiWordmark'
import { WEICUP_EVENT_ID } from '../lib/media'
import pullsPoster from '../assets/video-posters/pulls.jpg'
import cdfPoster from '../assets/video-posters/cdf.jpg'
import galaPoster from '../assets/video-posters/gala.jpg'

const BASE =
  'https://qsaqxynxiwcbvxfndweb.supabase.co/storage/v1/object/public/event-images/'

const MILESTONES = [
  {
    title: 'WEI — Édition ?',
    date: '25-27 septembre 2026',
    note: 'Chut… on prépare quelque chose 👀',
    custom: true,
    logoBg: '#0f1564',
    to: `/evenements/${WEICUP_EVENT_ID}`,
  },
  {
    title: 'Pull de promo',
    date: 'Février / mars 2027',
    media: BASE + 'video%20coloris%20pulls%20bde%202026.mp4',
    poster: pullsPoster,
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
    media: BASE + 'CDF%20recap%202024%20carrousel%20.mov',
    poster: cdfPoster,
  },
  {
    title: 'Gala IAE Paris Sorbonne',
    date: 'Mai 2027',
    media: BASE + 'gala.mov',
    poster: galaPoster,
  },
]

const PIXELS_PER_SECOND = 28
const PAUSE_AFTER_MANUAL_MS = 2500

export default function AnnualMilestones() {
  const scrollRef = useRef(null)
  const pausedRef = useRef(false)
  const resumeTimeoutRef = useRef(null)
  const directionRef = useRef(1)

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
          // Bounce back and forth rather than snapping to the start, which
          // read as a glitch.
          const next =
            el.scrollLeft + (directionRef.current * PIXELS_PER_SECOND * dt) / 1000

          if (next >= maxScroll) {
            el.scrollLeft = maxScroll
            directionRef.current = -1
          } else if (next <= 0) {
            el.scrollLeft = 0
            directionRef.current = 1
          } else {
            el.scrollLeft = next
          }
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
        const Tag = milestone.to ? Link : milestone.href ? 'a' : 'div'
        const linkProps = milestone.to
          ? { to: milestone.to }
          : milestone.href
            ? { href: milestone.href, target: '_blank', rel: 'noreferrer' }
            : {}
        return (
          <Tag
            key={milestone.title}
            {...linkProps}
            className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl bg-ink p-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <p className="text-xs font-bold uppercase italic tracking-wide text-accent">
              {milestone.date}
            </p>

            {milestone.custom ? (
              <div
                className="flex aspect-square w-full items-center justify-center rounded-xl"
                style={{ backgroundColor: milestone.logoBg }}
              >
                <WeiWordmark className="text-6xl" />
              </div>
            ) : milestone.isLogo ? (
              <div
                className="flex aspect-square w-full items-center justify-center rounded-xl p-1"
                style={{ backgroundColor: milestone.logoBg || '#ffffff' }}
              >
                <EventMedia src={milestone.media} className="h-full w-full object-contain" />
              </div>
            ) : (
              <div className="aspect-square w-full overflow-hidden rounded-xl">
                <EventMedia
                  src={milestone.media}
                  poster={milestone.poster}
                  className="h-full w-full object-cover"
                />
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
