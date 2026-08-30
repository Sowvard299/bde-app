import { useEffect, useRef, useState } from 'react'
import { isVideoUrl } from '../lib/media'

// Videos whose autoplay was refused by the browser. iOS Safari blocks all
// autoplay while the phone is in Low Power Mode (and in a few other cases),
// even for muted inline video — but it allows playback once the user has
// interacted with the page. So we keep the blocked ones here and retry them
// all on the first tap anywhere on the site.
const pendingPlayback = new Set()
let retryListenerAttached = false

function retryPendingPlayback() {
  for (const video of pendingPlayback) {
    video.play().catch(() => {})
  }
  pendingPlayback.clear()
}

function attachRetryListener() {
  if (retryListenerAttached) return
  retryListenerAttached = true
  const options = { passive: true }
  window.addEventListener('touchstart', retryPendingPlayback, options)
  window.addEventListener('pointerdown', retryPendingPlayback, options)
  window.addEventListener('scroll', retryPendingPlayback, options)
}

// Renders an event's image_url as a video (autoplay, muted, looping) when
// it points at a video file, or as a plain image otherwise — same field,
// same callers, no schema change needed.
//
// The size/shape className (h-16 w-16, aspect-[4/3], rounded-xl, etc.) goes
// on a wrapper div, and the media itself always fills that wrapper at
// 100%/100% via inline style — iOS Safari sometimes ignores the Tailwind
// object-fit class directly on <video>, and an inline style would otherwise
// override (and break) any size classes passed straight to the element.
//
// A video's src is only attached once it scrolls into view. Several of our
// event videos weigh 20-40MB; loading them all at once overwhelmed iOS
// Safari and made playback fail outright.
//
// `badge` renders a small marker (e.g. "*") in the bottom-right corner, for
// cases like reused footage from a previous edition.
export default function EventMedia({ src, alt = '', className, badge }) {
  const isVideo = isVideoUrl(src)
  const wrapperRef = useRef(null)
  const videoRef = useRef(null)
  const [activated, setActivated] = useState(false)
  const objectFit = className?.includes('object-contain') ? 'contain' : 'cover'
  const mediaStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition: 'center',
  }

  useEffect(() => {
    if (!isVideo || activated) return
    const el = wrapperRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActivated(true)
      },
      { rootMargin: '200px', threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isVideo, activated])

  function tryPlay() {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    const playPromise = video.play()
    if (!playPromise) return
    playPromise.catch(() => {
      pendingPlayback.add(video)
      attachRetryListener()
    })
  }

  useEffect(() => {
    return () => {
      if (videoRef.current) pendingPlayback.delete(videoRef.current)
    }
  }, [])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={activated ? src : undefined}
          style={mediaStyle}
          muted
          loop
          autoPlay
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          preload={activated ? 'auto' : 'none'}
          onLoadedData={tryPlay}
          onCanPlay={tryPlay}
        />
      ) : (
        <img src={src} alt={alt} style={mediaStyle} loading="lazy" />
      )}
      {badge && (
        <span className="absolute bottom-1 right-1 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">
          {badge}
        </span>
      )}
    </div>
  )
}
