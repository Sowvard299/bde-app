import { useEffect, useRef, useState } from 'react'
import { isVideoUrl } from '../lib/media'

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
// Videos only start loading/playing once actually scrolled into view, and
// pause again once they leave it. Several of our event videos are 20-40MB —
// letting every card autoplay+fully-preload at once overwhelms iOS Safari's
// decoder and made playback silently fail (showing a "tap to play" button)
// or even crash the tab. Only the visible card(s) now ask to play.
//
// `badge` renders a small marker (e.g. "*") in the bottom-right corner, for
// cases like reused footage from a previous edition.
export default function EventMedia({ src, alt = '', className, badge }) {
  const isVideo = isVideoUrl(src)
  const videoRef = useRef(null)
  const [inView, setInView] = useState(false)
  const objectFit = className?.includes('object-contain') ? 'contain' : 'cover'
  const mediaStyle = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit,
    objectPosition: 'center',
  }

  useEffect(() => {
    if (!isVideo) return
    const el = videoRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isVideo])

  useEffect(() => {
    if (!isVideo) return
    const el = videoRef.current
    if (!el) return

    if (inView) {
      el.muted = true
      const playPromise = el.play()
      if (playPromise) playPromise.catch(() => {})
    } else {
      el.pause()
    }
  }, [inView, isVideo])

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      {isVideo ? (
        <video
          ref={videoRef}
          src={src}
          style={mediaStyle}
          muted
          loop
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          preload="metadata"
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
