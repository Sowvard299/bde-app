// Les descriptions de partenaires sont saisies en texte brut, mais elles
// ont une structure : des intertitres introduits par un emoji, des listes
// à puces en « • » ou « - », et des paragraphes. Rendues telles quelles
// avec `whitespace-pre-line`, elles formaient un mur illisible.
//
// On rétablit cette structure au rendu, sans rien changer en base : les
// puces deviennent une vraie liste, les intertitres se détachent, et les
// paragraphes respirent.

// Une ligne commençant par un pictogramme sert d'intertitre dans toutes
// nos fiches. `\p{Extended_Pictographic}` couvre les emoji sans avoir à
// énumérer des plages de code points à la main.
const HEADING = /^\p{Extended_Pictographic}/u
const BULLET = /^[•\-–]\s+/

function blocksFrom(text) {
  const blocks = []

  for (const rawLine of text.replace(/\r/g, '').split('\n')) {
    const line = rawLine.trim()

    if (!line) continue

    if (BULLET.test(line)) {
      const item = line.replace(BULLET, '')
      const last = blocks[blocks.length - 1]
      if (last?.type === 'list') last.items.push(item)
      else blocks.push({ type: 'list', items: [item] })
      continue
    }

    blocks.push({ type: HEADING.test(line) ? 'heading' : 'paragraph', text: line })
  }

  return blocks
}

export default function PartnerDescription({ text }) {
  const blocks = blocksFrom(text)

  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, index) => {
        if (block.type === 'list') {
          return (
            <ul key={index} className="flex flex-col gap-2.5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3 text-fg-muted">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )
        }

        if (block.type === 'heading') {
          return (
            <h2
              key={index}
              className="mt-2 font-display text-lg font-semibold leading-snug text-fg first:mt-0"
            >
              {block.text}
            </h2>
          )
        }

        return (
          <p key={index} className="leading-relaxed text-fg-muted">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}
