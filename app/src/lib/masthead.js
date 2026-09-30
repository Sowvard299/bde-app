// Taille d'un titre en Advercase, calée sur la largeur de son conteneur.
//
// Les capitales d'Advercase font en moyenne 0,55 à 0,62 fois la taille de
// la police (mesuré dans le navigateur) : un mot de n lettres occupe donc
// environ 0,64 × n em, marge comprise. On en déduit la taille qui fait
// tenir le mot le plus long sur une ligne, en unités de conteneur (cqw),
// pour qu'un titre long (« Confidentialité ») ne déborde jamais de l'écran
// et qu'un titre court (« Bars ») reste très grand. Le parent doit porter
// la classe `@container`.
export function tailleMasthead(texte, { min = '2.25rem', max = '9rem', ratio = 0.64 } = {}) {
  const motLePlusLong = Math.max(1, ...String(texte ?? '').split(/\s+/).map((mot) => mot.length))
  return `clamp(${min}, ${(100 / (motLePlusLong * ratio)).toFixed(2)}cqw, ${max})`
}
