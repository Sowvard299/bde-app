import { useMediaQuery } from './useMediaQuery'

// Vrai quand l'utilisateur a demandé moins d'animations à son système.
// Les effets restent visibles, mais figés sur une image.
export function useMoinsDAnimations() {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
