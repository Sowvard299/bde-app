# Jeu de donnees « Bars de Paris »

Ce dossier contient la source de l'onglet `/bars`. Rien ici n'est servi au
navigateur : c'est l'atelier, le produit fini est
`app/src/data/bars-paris.json`.

- `bars-paris-v3.json` — la compilation complete des 193 adresses (150 bars
  pas chers, 43 insolites), coordonnees comprises. C'est le fichier a
  modifier quand la selection change.
- `geocode.py` — remplit `latitude` / `longitude` a partir des adresses, via
  l'API Adresse de data.gouv.fr (service public, sans cle). A relancer
  seulement apres avoir ajoute ou corrige des adresses.
- `build-bars.py` — compacte le fichier source vers `app/src/data/`. Il
  retire les champs que l'interface n'utilise pas et les valeurs nulles :
  334 Ko deviennent 123 Ko, soit environ 20 Ko une fois compresses.

## Mettre la selection a jour

```sh
python data/geocode.py      # seulement si des adresses ont bouge
python data/build-bars.py
```

Puis reconstruire l'app normalement. Aucune migration SQL, aucune ecriture
dans Supabase : ces adresses sont des donnees de reference figees, elles
n'ont pas leur place dans une base dont le quota gratuit est deja serre.
