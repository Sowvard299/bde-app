import logoWhite from '../assets/logo-mark-white.png'

// Le phénix du BDE, dans la couleur du texte qui l'entoure.
//
// Le fichier sert de masque : la forme vient de l'image, la couleur de
// `currentColor`. Le même logo passe ainsi en bleu nuit exact de la charte
// dans l'en-tête et en blanc dans le pied de page, sans une version par
// couleur — la version bleue livrée avec le site était d'un bleu voisin
// (#2D3179), pas celui de la charte.
export default function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        WebkitMaskImage: `url(${logoWhite})`,
        maskImage: `url(${logoWhite})`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}
