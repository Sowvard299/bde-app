import { isVideoUrl } from '../lib/media'

// Renders an event's image_url as a video (autoplay, muted, looping) when
// it points at a video file, or as a plain image otherwise — same field,
// same callers, no schema change needed.
export default function EventMedia({ src, alt = '', className }) {
  if (isVideoUrl(src)) {
    const objectFit = className?.includes('object-contain') ? 'contain' : 'cover'
    return (
      <video
        src={src}
        className={className}
        // iOS Safari sometimes ignores the Tailwind object-fit class on
        // <video> unless it's also set inline, and needs explicit
        // width/height to size itself inside the aspect-ratio wrapper.
        style={{ width: '100%', height: '100%', objectFit, objectPosition: 'center' }}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        disablePictureInPicture
        preload="auto"
      />
    )
  }

  return <img src={src} alt={alt} className={className} />
}
