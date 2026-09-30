import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import EventMedia from './EventMedia'
import { R2_MEDIA_BASE, WEICUP_EVENT_ID, WEICUP_LOGO } from '../lib/media'
import pullsPoster from '../assets/video-posters/pulls.jpg'
import cdfPoster from '../assets/video-posters/cdf.jpg'
import galaPoster from '../assets/video-posters/gala.jpg'

const ACTIVITIES_BASE = R2_MEDIA_BASE + 'activities/'

// Les grands rendez-vous de l'année, dans l'ordre. Le WEI reste en tête
// même une fois passé : c'est le premier gros événement de l'année, et la
// frise sert à montrer l'année entière, pas seulement ce qui reste à venir.
const RENDEZ_VOUS = [
  {
    titre: 'WEICUP Latino Edition',
    date: 'Septembre 2026',
    media: WEICUP_LOGO,
    fond: '#f7b422',
    contenir: true,
    to: `/evenements/${WEICUP_EVENT_ID}`,
  },
  {
    titre: 'Pull de promo',
    date: 'Février – mars 2027',
    media: R2_MEDIA_BASE + 'pulls.mp4',
    poster: pullsPoster,
  },
  {
    titre: "Concours inter-IAE d'éloquence",
    date: 'Mars 2027',
    media: ACTIVITIES_BASE + 'concours-eloquence.jpeg',
    contenir: true,
  },
  {
    titre: 'Coupe de France des IAE',
    date: 'Avril 2027',
    media: R2_MEDIA_BASE + 'cdf.mov',
    poster: cdfPoster,
  },
  {
    titre: 'Gala IAE Paris Sorbonne',
    date: 'Mai 2027',
    media: R2_MEDIA_BASE + 'gala.mov',
    poster: galaPoster,
  },
]

const PIXELS_PAR_SECONDE = 28
const PAUSE_APRES_GESTE_MS = 2500

// Frise qui défile seule, en aller-retour (revenir d'un coup au début se
// lisait comme un bug). Elle s'arrête dès qu'on la touche, qu'on la
// survole ou qu'on la fait défiler, et repart peu après.
export default function AnnualMilestones() {
  const pisteRef = useRef(null)
  const enPauseRef = useRef(false)
  const repriseRef = useRef(null)

  useEffect(() => {
    const piste = pisteRef.current
    if (!piste) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // La position est tenue en décimal ici : certains navigateurs
    // arrondissent scrollLeft à l'entier, et un demi-pixel par image
    // n'avancerait alors jamais.
    let position = piste.scrollLeft
    let sens = 1
    let precedent = null
    let idImage

    function avancer(temps) {
      const dt = precedent === null ? 0 : Math.min(temps - precedent, 100)
      precedent = temps

      if (enPauseRef.current) {
        position = piste.scrollLeft
      } else {
        const max = piste.scrollWidth - piste.clientWidth
        if (max > 0) {
          position += (sens * PIXELS_PAR_SECONDE * dt) / 1000
          if (position >= max) {
            position = max
            sens = -1
          } else if (position <= 0) {
            position = 0
            sens = 1
          }
          piste.scrollLeft = position
        }
      }
      idImage = requestAnimationFrame(avancer)
    }

    idImage = requestAnimationFrame(avancer)
    return () => {
      cancelAnimationFrame(idImage)
      clearTimeout(repriseRef.current)
    }
  }, [])

  function pause() {
    enPauseRef.current = true
    clearTimeout(repriseRef.current)
    repriseRef.current = setTimeout(() => {
      enPauseRef.current = false
    }, PAUSE_APRES_GESTE_MS)
  }

  function pauseTenue() {
    enPauseRef.current = true
    clearTimeout(repriseRef.current)
  }

  return (
    <ol
      ref={pisteRef}
      onPointerDown={pause}
      onTouchStart={pause}
      onWheel={pause}
      onMouseEnter={pauseTenue}
      onMouseLeave={pause}
      onFocus={pauseTenue}
      onBlur={pause}
      className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2 lg:-mx-10 lg:gap-6 lg:px-10"
    >
      {RENDEZ_VOUS.map((rdv, index) => {
        const Tag = rdv.to ? Link : 'div'
        return (
          <li key={rdv.titre} className="w-[68vw] max-w-[280px] shrink-0 lg:w-[280px]">
            <Tag
              {...(rdv.to ? { to: rdv.to } : {})}
              className={`group block ${rdv.to ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent' : ''}`}
            >
              <div className="zoom-media overflow-hidden border-2 border-ink">
                {rdv.contenir ? (
                  <div
                    className="flex aspect-square w-full items-center justify-center p-4"
                    style={{ backgroundColor: rdv.fond ?? '#fff' }}
                  >
                    <EventMedia src={rdv.media} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <EventMedia
                    src={rdv.media}
                    poster={rdv.poster}
                    className="aspect-square w-full object-cover"
                    fallbackLabel={rdv.titre}
                  />
                )}
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2">
                <p className="label text-fg-subtle">{rdv.date}</p>
                <p className="label text-fg-subtle">{String(index + 1).padStart(2, '0')}</p>
              </div>
              <p className="mt-1.5 font-display text-2xl uppercase leading-[0.92]">
                {rdv.titre}
                {rdv.to && (
                  <span aria-hidden="true" className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                )}
              </p>
            </Tag>
          </li>
        )
      })}
    </ol>
  )
}
