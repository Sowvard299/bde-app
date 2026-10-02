// Séries d'événements, reprises des publications Instagram de la charte :
// Sorbonne Sport en doré, Sorbonne Night en rose, Sorbonne Culture en
// orange. Tout le reste est rangé sous « BDE », en blanc.
//
// La série se déduit du titre : la base n'a pas de colonne pour ça, et
// les titres suivent déjà ces noms (« Sorbonne Night #1 », « Sorbonne
// Running × ASICS »). Un titre qui ne dit rien de sa série tombe
// simplement dans « BDE », sans erreur.
//
// `hex` sert aux effets WebGL, qui ne lisent pas les variables CSS.
// `trame` est le motif de la trame animée propre à la série (voir
// components/Trame.jsx) : la même technique partout, un mouvement par
// univers.
export const SERIES = {
  sport: { label: 'Sorbonne Sport', couleur: 'var(--color-accent-gold)', hex: '#ffc300', trame: 'wave' },
  night: { label: 'Sorbonne Night', couleur: 'var(--color-accent-pink)', hex: '#ff66c4', trame: 'ripple' },
  culture: { label: 'Sorbonne Culture', couleur: 'var(--color-accent)', hex: '#ff4214', trame: 'swirl' },
  bde: { label: 'BDE', couleur: '#ffffff', hex: '#ffffff', trame: 'simplex' },
}

// Culture passe avant Night : « Soirée impro » est une sortie culturelle,
// pas une soirée du BDE.
const MOTS = [
  ['sport', /run|running|escalade|climb|sport|match|foot|basket|rugby|handball|stade|psg|tournoi/i],
  ['culture', /culture|th[ée][âa]tre|mus[ée]e|louvre|nocturne|impro|humour|games?\b|expo|cin[ée]ma|concert|visite|[ée]loquence/i],
  ['night', /night|party|soir[ée]e|wei|gala|afterwork|halloween/i],
]

export function serieEvenement(evenement) {
  const titre = evenement?.title ?? ''
  const trouvee = MOTS.find(([, motif]) => motif.test(titre))
  return SERIES[trouvee ? trouvee[0] : 'bde']
}
