# -*- coding: utf-8 -*-
"""Compacte bars-paris-v3.json (geocode) en payload embarque dans l'app.

Usage : python data/build-bars.py
"""
import json, sys, os

sys.stdout.reconfigure(encoding="utf-8")

SRC = os.path.join(os.path.dirname(__file__), "bars-paris-v3.json")
DST = os.path.join(os.path.dirname(__file__), "..", "app", "src", "data", "bars-paris.json")

d = json.load(open(SRC, encoding="utf-8"))

PRIX_KEYS = [
    "pinte_hh", "pinte_hors_hh", "cocktail", "verre_vin", "ticket_entree",
    "litre_meilleur", "note_litre", "tournee_20_pers", "soft",
]

out = []
for e in d["etablissements"]:
    prix = {k: e["prix"][k] for k in PRIX_KEYS if e["prix"].get(k) is not None}
    row = {
        "id": e["id"],
        "type": e["type"],
        "nom": e["nom"],
        "adresse": e["adresse_complete"],
        "arrondissement": e["arrondissement"],
        "lat": e["latitude"],
        "lon": e["longitude"],
        "flags": e["flags"],
        "source": e["source"],
        "fiabilite": e["fiabilite"],
    }
    if prix:
        row["prix"] = prix
    for k, dst in [
        ("metro", "metro"), ("happy_hour", "happy_hour"), ("horaires", "horaires"),
        ("bon_plan", "bon_plan"), ("concept", "concept"), ("notes", "notes"),
        ("happy_hour_struct", "hh"), ("sans_alcool", "sans_alcool"),
        ("note_sans_alcool", "note_sans_alcool"),
    ]:
        v = e.get(k)
        if v not in (None, "", "non-evalue"):
            row[dst] = v
    out.append(row)

# La taxonomie sert a libeller les flags : on garde cle -> libelle, a plat.
libelles = {}
for groupe in d["taxonomie"].values():
    for f in groupe["flags"]:
        libelles[f["cle"]] = f["libelle"]

payload = {
    "maj": d["meta"]["date"],
    "avertissement": d["meta"]["avertissement_legal"],
    "avertissement_donnees": d["meta"]["avertissement_donnees"],
    "sources": [{"nom": s["nom"], "url": s["url"]} for s in d["meta"]["sources"]],
    "libelles": libelles,
    "lieux": out,
}

os.makedirs(os.path.dirname(DST), exist_ok=True)
with open(DST, "w", encoding="utf-8") as f:
    json.dump(payload, f, ensure_ascii=False, separators=(",", ":"))

print(f"{len(out)} lieux -> {DST}")
print(f"{os.path.getsize(DST) / 1024:.0f} Ko")
