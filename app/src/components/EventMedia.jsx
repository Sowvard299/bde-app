import { isVideoUrl } from '../lib/media'

// Renders an event's image_url as a video (autoplay, muted, looping) when
// it points at a video file, or as a plain image otherwise — same field,
// same callers, no schema change needed.
//
// The size/shape className (h-16 w-16, aspect-[4/3], rounded-xl, etc.) goes
// on a wrapper div, and the <video> itself always fills that wrapper at
// 100%/100% via inline style — iOS Safari sometimes ignores the Tailwind
// object-fit class directly on <video>, and an inline style would otherwise
// override (and break) any size classes passed straight to the element.
export default function EventMedia({ src, alt = '', className }) {
  if (isVideoUrl(src)) {
    const objectFit = className?.includes('object-contain') ? 'contain' : 'cover'
    return (
      <div className={className} style={{ overflow: 'hidden' }}>
        <video
          src={src}
          style={{ display: 'block', width: '100%', height: '100%', objectFit, objectPosition: 'center' }}
          autoPlay
          muted
          loop
          playsInline
          webkit-playsinline="true"
          disablePictureInPicture
          preload="auto"
        />
      </div>
    )
  }

  return <img src={src} alt={alt} className={className} />
}
