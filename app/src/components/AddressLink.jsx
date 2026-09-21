import { lienCarte } from '../lib/maps'

// Une adresse qui s'ouvre dans l'application de cartes.
//
// Sans enfants, elle affiche l'adresse elle-même ; avec des enfants, elle
// habille ce qu'on lui donne (le pastille d'un événement, une ligne
// d'infos pratiques…). `nom` n'est pas affiché : il n'est envoyé qu'à
// l'application de cartes, pour qu'elle retrouve le commerce et pas
// seulement la rue.
export default function AddressLink({ nom, adresse, lat, lon, className = '', children }) {
  return (
    <a
      href={lienCarte({ nom, adresse, lat, lon })}
      target="_blank"
      rel="noreferrer"
      className={`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className}`}
    >
      {children ?? adresse}
    </a>
  )
}
