#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Remplit latitude / longitude dans bars-paris-v3.json.

Pourquoi ce script existe : l'environnement où la base a été construite n'a pas
accès au réseau ouvert. Lance-le depuis ton ordinateur, il fait le travail en
une fois.

Utilisation :
    python3 geocode.py

Aucune dépendance à installer, aucune clé d'API. Le script utilise l'API Adresse
de data.gouv.fr (service public, gratuit, illimité en usage raisonnable) en mode
CSV : un seul appel pour les 165 adresses, au lieu de 165 appels.

Sortie :
    bars-paris-v3.json         mis à jour avec latitude, longitude, geocodage_score
    geocodage-rapport.txt      la liste des adresses à revoir à la main
"""

import csv
import io
import json
import sys
import urllib.request

API = "https://api-adresse.data.gouv.fr/search/csv/"
JSON_PATH = "bars-paris-v3.json"
SEUIL_CONFIANCE = 0.6  # en dessous, l'adresse mérite un coup d'œil


def build_csv(etabs):
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["id", "adresse", "codepostal", "ville"])
    for e in etabs:
        w.writerow([e["id"], e["adresse"], e["code_postal"], e["ville"]])
    return buf.getvalue().encode("utf-8")


def post_multipart(url, filename, content):
    """POST multipart/form-data sans dépendance externe."""
    boundary = "----GeocodeBDEIAE"
    body = b"".join([
        f'--{boundary}\r\n'.encode(),
        f'Content-Disposition: form-data; name="data"; filename="{filename}"\r\n'.encode(),
        b'Content-Type: text/csv\r\n\r\n',
        content,
        f'\r\n--{boundary}\r\n'.encode(),
        b'Content-Disposition: form-data; name="columns"\r\n\r\nadresse\r\n',
        f'--{boundary}\r\n'.encode(),
        b'Content-Disposition: form-data; name="columns"\r\n\r\ncodepostal\r\n',
        f'--{boundary}\r\n'.encode(),
        b'Content-Disposition: form-data; name="columns"\r\n\r\nville\r\n',
        f'--{boundary}\r\n'.encode(),
        b'Content-Disposition: form-data; name="postcode"\r\n\r\ncodepostal\r\n',
        f'--{boundary}--\r\n'.encode(),
    ])
    req = urllib.request.Request(url, data=body, method="POST")
    req.add_header("Content-Type", f"multipart/form-data; boundary={boundary}")
    with urllib.request.urlopen(req, timeout=180) as r:
        return r.read().decode("utf-8")


def main():
    try:
        with open(JSON_PATH, encoding="utf-8") as f:
            data = json.load(f)
    except FileNotFoundError:
        sys.exit(f"Fichier introuvable : {JSON_PATH}\n"
                 f"Lance le script dans le dossier qui contient le JSON.")

    etabs = data["etablissements"]
    print(f"{len(etabs)} adresses à géocoder…")

    try:
        result = post_multipart(API, "adresses.csv", build_csv(etabs))
    except Exception as exc:
        sys.exit(f"Appel à l'API Adresse échoué : {exc}\n"
                 f"Vérifie ta connexion, puis relance.")

    coords = {}
    for row in csv.DictReader(io.StringIO(result)):
        lat = row.get("latitude") or ""
        lon = row.get("longitude") or ""
        score = row.get("result_score") or ""
        if lat and lon:
            coords[str(row["id"])] = (
                float(lat), float(lon),
                float(score) if score else None,
                row.get("result_label", ""),
            )

    ok = douteux = manquants = 0
    rapport = []
    for e in etabs:
        hit = coords.get(str(e["id"]))
        if not hit:
            manquants += 1
            rapport.append(f"INTROUVABLE  #{e['id']:>3}  {e['nom']} — {e['adresse_complete']}")
            continue
        lat, lon, score, label = hit
        e["latitude"] = round(lat, 6)
        e["longitude"] = round(lon, 6)
        e["geocodage_score"] = round(score, 2) if score is not None else None
        if score is not None and score < SEUIL_CONFIANCE:
            douteux += 1
            rapport.append(
                f"À VÉRIFIER   #{e['id']:>3}  {e['nom']}\n"
                f"             saisi  : {e['adresse_complete']}\n"
                f"             trouvé : {label}  (score {score:.2f})")
        else:
            ok += 1

    data["meta"]["geocodage"] = (
        "Fait via l'API Adresse (data.gouv.fr). "
        "© les contributeurs OpenStreetMap et la BAN.")

    with open(JSON_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    with open("geocodage-rapport.txt", "w", encoding="utf-8") as f:
        f.write(f"Géocodage — {ok} bonnes, {douteux} à vérifier, {manquants} introuvables\n")
        f.write("=" * 70 + "\n\n")
        f.write("\n".join(rapport) if rapport else "Rien à signaler.\n")

    print(f"\n  {ok} adresses géocodées proprement")
    print(f"  {douteux} à vérifier (score < {SEUIL_CONFIANCE})")
    print(f"  {manquants} introuvables")
    print(f"\n{JSON_PATH} mis à jour.")
    if rapport:
        print("Détail des cas douteux : geocodage-rapport.txt")


if __name__ == "__main__":
    main()
