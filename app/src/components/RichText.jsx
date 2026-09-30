// Mise en forme des descriptions saisies en base (partenaires et
// événements). Elles sont en texte brut, avec une structure simple :
//
//   # Intertitre
//   - élément de liste   (ou « • », « – »)
//   1. étape numérotée
//   paragraphe
//
// Les anciennes fiches introduisaient leurs intertitres par un emoji
// (« 🎁 Les avantages ») : la ligne reste reconnue comme intertitre, mais
// l'emoji n'est plus affiché.

const TITRE = /^#{1,3}\s+/
const TITRE_EMOJI = /^\p{Extended_Pictographic}(?:\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u200d|\ufe0f|\s)*/u
const PUCE = /^[•\-–]\s+/
const NUMERO = /^(\d+)[.)]\s+/

function blocsDepuis(texte) {
  const blocs = []

  for (const brute of texte.replace(/\r/g, '').split('\n')) {
    const ligne = brute.trim()
    if (!ligne) continue

    if (TITRE.test(ligne)) {
      blocs.push({ type: 'titre', texte: ligne.replace(TITRE, '') })
      continue
    }

    if (TITRE_EMOJI.test(ligne)) {
      blocs.push({ type: 'titre', texte: ligne.replace(TITRE_EMOJI, '') })
      continue
    }

    const numero = ligne.match(NUMERO)
    if (numero) {
      const item = ligne.replace(NUMERO, '')
      const dernier = blocs[blocs.length - 1]
      if (dernier?.type === 'etapes') dernier.items.push(item)
      else blocs.push({ type: 'etapes', items: [item] })
      continue
    }

    if (PUCE.test(ligne)) {
      const item = ligne.replace(PUCE, '')
      const dernier = blocs[blocs.length - 1]
      if (dernier?.type === 'liste') dernier.items.push(item)
      else blocs.push({ type: 'liste', items: [item] })
      continue
    }

    blocs.push({ type: 'paragraphe', texte: ligne })
  }

  return blocs
}

export default function RichText({ text, className = '' }) {
  if (!text) return null
  const blocs = blocsDepuis(text)

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {blocs.map((bloc, index) => {
        if (bloc.type === 'titre') {
          return (
            <h2 key={index} className="label mt-4 border-t-2 border-ink pt-3 text-[12px] text-ink first:mt-0">
              {bloc.texte}
            </h2>
          )
        }

        if (bloc.type === 'liste') {
          return (
            <ul key={index} className="flex flex-col gap-2">
              {bloc.items.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-fg-muted">
                  <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 bg-ink" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (bloc.type === 'etapes') {
          return (
            <ol key={index} className="flex flex-col gap-2">
              {bloc.items.map((item, i) => (
                <li key={i} className="flex gap-3 leading-relaxed text-fg-muted">
                  <span className="label w-6 shrink-0 pt-[0.2em] text-ink">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          )
        }

        return (
          <p key={index} className="leading-relaxed text-fg-muted">
            {bloc.texte}
          </p>
        )
      })}
    </div>
  )
}
