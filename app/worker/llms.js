// /llms-full.txt : tout le contenu utile du site en un seul texte brut.
//
// llms.txt (fichier statique) présente le site et ses pages. Ce fichier-ci
// donne le contenu lui-même : agenda à venir, partenaires, et les 193 bars
// avec leurs prix, arrondissement par arrondissement. C'est ce qu'un
// assistant (ChatGPT, Perplexity, Claude) lit le plus facilement quand il
// cherche une réponse précise, et il est produit à chaque fois depuis les
// mêmes données que les pages : il ne peut pas prendre de retard sur elles.
import donneesBars from '../src/data/bars-paris.json'
import { formatEuro, prixRepere } from '../src/lib/bars'
import { cheminBar, indexBars, resumeHappyHour, trierParPrix } from '../src/lib/barsSeo'
import { chiffresBars, faqBars } from '../src/lib/geo'
import {
  ASSOCIATION,
  FAQ_ASSOCIATION,
  FAQ_PARTENAIRES,
  NOM_SITE,
  SITE,
  estComplet,
  heureParis,
  jourParis,
  prixEvenement,
  texteBrut,
} from '../src/lib/seo'
import { listerEvenementsAVenir, listerPartenairesComplets } from './supabase'

const faq = (items) => items.map(({ q, r }) => `### ${q}\n\n${r}`).join('\n\n')

function evenement(ev) {
  const heure = heureParis(ev.starts_at)
  const lieu = [ev.location_name, ev.location_address].filter(Boolean).join(', ')
  const prix = prixEvenement(ev.price_cents)
  const description = texteBrut(ev.description)
  return [
    `### ${ev.title}`,
    '',
    `- Date : ${jourParis(ev.starts_at)}${heure ? ` à ${heure}` : ' (heure communiquée prochainement)'}`,
    lieu ? `- Lieu : ${lieu}` : null,
    prix ? `- Tarif : ${prix}` : null,
    estComplet(ev) ? '- Complet' : ev.ticket_url ? `- Billetterie : ${ev.ticket_url}` : null,
    `- Page : ${SITE}/evenements/${ev.id}`,
    description ? `\n${description}` : null,
  ]
    .filter((l) => l != null)
    .join('\n')
}

function bar(lieu) {
  const p = prixRepere(lieu)
  const hh = resumeHappyHour(lieu)
  const morceaux = [
    lieu.adresse,
    lieu.metro ? `métro ${lieu.metro}` : null,
    p ? `${formatEuro(p.valeur)} ${p.libelle}` : null,
    lieu.prix?.pinte_hh != null && lieu.prix?.pinte_hors_hh != null ? `${formatEuro(lieu.prix.pinte_hors_hh)} la pinte hors happy hour` : null,
    hh,
    lieu.type === 'insolite' && lieu.concept ? lieu.concept.replace(/\.$/, '') : null,
  ].filter(Boolean)
  return `- [${lieu.nom}](${SITE}${cheminBar(donneesBars.lieux, lieu)}) : ${morceaux.join(' ; ')}`
}

export async function llmsComplet() {
  const [evenements, partenaires] = await Promise.all([listerEvenementsAVenir(), listerPartenairesComplets()])
  const { arrondissements } = indexBars(donneesBars.lieux)
  const date = donneesBars.maj.split('-').reverse().join('/')

  return `# ${NOM_SITE} : contenu complet

> Site officiel du ${ASSOCIATION.nomLegal} (${ASSOCIATION.sigle}), association étudiante de
> l'${ASSOCIATION.ecole}, association loi 1901 fondée en ${ASSOCIATION.fondation},
> ${ASSOCIATION.adresse}, ${ASSOCIATION.codePostal} ${ASSOCIATION.ville}. Contact : ${ASSOCIATION.email}.
> Version texte de ${SITE}, produite à partir des mêmes données que les pages.
> Présentation courte du site : ${SITE}/llms.txt

## L'association

${faq(FAQ_ASSOCIATION)}

## Événements à venir

${evenements?.length ? evenements.map(evenement).join('\n\n') : `Aucun événement annoncé pour le moment. Agenda : ${SITE}/evenements`}

## Réductions étudiantes (partenaires)

${
  partenaires?.length
    ? partenaires
        .map((pa) => `- [${pa.name}](${SITE}/partenaires/${pa.id}) : ${pa.benefit}${pa.address ? ` (${pa.address})` : ''}`)
        .join('\n')
    : `Liste : ${SITE}/partenaires`
}

${faq(FAQ_PARTENAIRES)}

## Bars de Paris

Sélection de ${donneesBars.lieux.length} bars parisiens relevée par le BDE le ${date} : prix pouvant avoir changé
depuis, toute reprise devrait citer cette date. Carte interactive : ${SITE}/bars

${chiffresBars(donneesBars.lieux, donneesBars.maj)
  .map((c) => `- ${c.valeur} : ${c.libelle}`)
  .join('\n')}

${faq(faqBars(donneesBars.lieux, donneesBars.maj))}

${arrondissements
  .map(
    (a) =>
      `### Bars ${a.libelle} (${a.lieux.length})${a.aSaPage ? `\n\nPage : ${SITE}/bars/${a.slug}` : ''}\n\n${trierParPrix(a.lieux, prixRepere)
        .map(bar)
        .join('\n')}`
  )
  .join('\n\n')}

${donneesBars.avertissement}
`
}
