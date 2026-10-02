import Trame from './Trame'

// L'ombre portée du site (un aplat décalé, voir `.lift`), mais tramée et
// animée aux couleurs de la série : le visuel d'un événement « sort » de
// sa trame. Avec `survol`, le contenu se soulève au passage de la souris
// et découvre un peu plus la trame.
export default function OmbreTramee({ serie, survol = false, className = '', children }) {
  return (
    <div className={`ombre-tramee ${survol ? 'ombre-tramee--survol' : ''} ${className}`}>
      {/* Le motif est centré sur le coin bas droit : c'est la seule partie
          de la trame qui dépasse du contenu. */}
      <Trame
        serie={serie}
        taille={3}
        echelle={0.5}
        offsetX={0.5}
        offsetY={-0.5}
        className="ombre-tramee__trame border-2 border-ink"
      />
      <div className="ombre-tramee__contenu">{children}</div>
    </div>
  )
}
