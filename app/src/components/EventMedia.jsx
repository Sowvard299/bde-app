import { isVideoUrl } from '../lib/media'

// Renders an event's image_url as a video (autoplay, muted, looping) when
// it points at a video file, or as a plain image otherwise — same field,
// same callers, no schema change needed.
export default function EventMedia({ src, alt = '', className }) {
  if (isVideoUrl(src)) {
    return (
      <video
        src={src}
        className={className}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    )
  }

  return <img src={src} alt={alt} className={className} />
}
