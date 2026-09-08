import { useEffect, useRef, useState } from 'react'

// Fait apparaître son contenu quand il entre dans l'écran. Une seule fois :
// on se désabonne dès que c'est joué, pour ne pas rejouer l'animation à
// chaque aller-retour de défilement (agaçant sur mobile).
//
// `delay` décale l'apparition, ce qui permet de faire monter une grille
// d'éléments en cascade plutôt que d'un bloc.
export default function Reveal({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Pas d'IntersectionObserver (très vieux navigateur) : on affiche tout
    // de suite plutôt que de laisser la page vide.
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
