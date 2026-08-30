import { useEffect, useRef, useState } from 'react'
import { isVideoUrl } from '../lib/media'

// Videos whose autoplay was refused by the browser (iOS Low Power Mode blocks
// it outright, even for muted inline video). We keep them here and retry on
// the next tap/scroll anywhere on the site — a cheap opportunistic recovery,
// on top of the still frame each video falls back to while it's stuck.
const pendingPlayback = new Set()
let retryListenerAttached = false

function retryPendingPlayback() {
  for (const video of pendingPlayback) {
    video.play().catch(() => {})
  }
}

function attachRetryListener() {
  if (retryListenerAttached) return
  retryListenerAttached = true
  const options = { passive: true }
  window.addEventListener('touchstart', retryPendingPlayback, options)
  window.addEventListener('touchmove', retryPendingPlayback, options)
  window.addEventListener('pointerdown', retryPendingPlayback, options)
  window.addEventListener('scroll', retryPendingPlayback, options)
}

// How long to wait for playback to actually start before giving up on the
// live video and freezing it as a still image instead — iOS in particular
// can refuse muted autoplay outright (Low Power Mode, etc.), and a video
// stuck on a spinner or a "tap to play" button reads as broken. A calm still
// frame reads as intentional.
const FALLBACK_DELAY_MS = 5000

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
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTapHint, setShowTapHint] = useState(false)
  const [stillFrame, setStillFrame] = useState(null)
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

  // Grace period after activation — if playback still hasn't started by
  // then, freeze the current frame as a still image (or fall back to a tap
  // button if we can't grab one).
  useEffect(() => {
    if (!activated || isPlaying || stillFrame) return
    const timer = setTimeout(() => freezeFrame(), FALLBACK_DELAY_MS)
    return () => clearTimeout(timer)
  }, [activated, isPlaying, stillFrame])

  function freezeFrame() {
    const video = videoRef.current
    try {
      if (!video || !video.videoWidth) throw new Error('no frame yet')
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height)
      setStillFrame(canvas.toDataURL('image/jpeg', 0.82))
    } catch {
      // Couldn't grab a frame (nothing decoded yet, CORS, etc.) — fall back
      // to a manual tap-to-play button instead.
      setShowTapHint(true)
    }
  }

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

  function handleTap() {
    const video = videoRef.current
    if (!video) return
    video.muted = true
    video.play().catch(() => {})
  }

  useEffect(() => {
    const video = videoRef.current
    return () => {
      if (video) pendingPlayback.delete(video)
    }
  }, [])

  const needsTap = isVideo && showTapHint && !isPlaying && !stillFrame
  const isLoading = isVideo && activated && !isPlaying && !showTapHint && !stillFrame

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isVideo ? '#1e1e2a' : undefined,
      }}
      onClick={needsTap || stillFrame ? handleTap : undefined}
    >
      {isVideo ? (
        <video
          ref={videoRef}
          src={activated ? src : undefined}
          style={{ ...mediaStyle, visibility: stillFrame ? 'hidden' : 'visible' }}
          muted
          loop
          autoPlay
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          crossOrigin="anonymous"
          preload={activated ? 'auto' : 'none'}
          onLoadedData={tryPlay}
          onCanPlay={tryPlay}
          onPlaying={() => {
            setIsPlaying(true)
            setShowTapHint(false)
            setStillFrame(null)
          }}
          onPause={() => setIsPlaying(false)}
        />
      ) : (
        <img src={src} alt={alt} style={mediaStyle} loading="lazy" />
      )}
      {stillFrame && (
        <img
          src={stillFrame}
          alt={alt}
          style={{ ...mediaStyle, position: 'absolute', inset: 0 }}
        />
      )}
      {isLoading && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
        </span>
      )}
      {needsTap && (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="white" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </span>
      )}
      {badge && (
        <span className="absolute bottom-1 right-1 rounded bg-black/30 px-1.5 py-0.5 text-[10px] font-bold text-white/90 backdrop-blur-sm">
          {badge}
        </span>
      )}
    </div>
  )
}
