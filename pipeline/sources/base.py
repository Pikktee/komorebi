"""Gemeinsame Konstanten, das Zielschema und Hilfsfunktionen für alle Quellen.

Jeder Scraper liefert Rohdaten als ``dict``; ``normalize.normalize_record`` bildet sie
auf das in ``datenmodell.md`` beschriebene Zielschema ab.
"""
from __future__ import annotations

import hashlib
import re
from typing import Iterable

# Kontrolliertes Vokabular für Tätigkeitsfelder (siehe datenmodell.md)
TAETIGKEITSFELDER = [
    "Naturschutz",
    "Artenschutz/Tiere",
    "Meeresschutz",
    "Forschung/Feldassistenz",
    "Landwirtschaft/Permakultur",
    "Wald/Forst",
    "Umweltbildung",
    "Klima/Nachhaltigkeit",
    "Sonstiges",
]

KONTINENTE = [
    "Europa",
    "Afrika",
    "Asien",
    "Nordamerika",
    "Südamerika",
    "Ozeanien",
    "Antarktis",
]

PROGRAMME = ["ESC", "IJFD", "weltwärts", "kulturweit", "keins"]

# Bei diesen Förderprogrammen sind Kost & Unterkunft per Definition kostenlos gestellt.
PROGRAMME_MIT_FREIER_KOST = {"ESC", "IJFD", "weltwärts", "kulturweit"}

# Top-Level-Felder des Zielschemas (für Validierung/Tests)
SCHEMA_FELDER = [
    "id", "titel", "organisation", "aufnahmeorganisation", "entsendeorganisation",
    "land", "region", "kontinent", "dauer_monate_min", "dauer_monate_max",
    "zeitraum_von", "zeitraum_bis", "flexibler_start", "taetigkeitsfeld",
    "beschreibung", "bewerbungsfrist", "voraussetzungen", "programm",
    "kost_unterkunft_frei", "kostenpflichtig", "teilnahmegebuehr_eur",
    "taschengeld_eur_monat", "reisekosten_erstattet", "versicherung", "sprachkurs",
    "quelle", "quell_url", "weitere_quell_urls", "quell_id",
    "erstmals_gesehen", "zuletzt_gesehen", "zuletzt_geaendert",
    "geo_lat", "geo_lon", "geo_genauigkeit", "geo_label",
]

VORAUSSETZUNGEN_FELDER = ["mindestalter", "hoechstalter", "sprache", "vorkenntnisse"]


def slug(text: str) -> str:
    """Vereinheitlicht einen String für Vergleiche/IDs (klein, ohne Sonderzeichen)."""
    text = (text or "").lower().strip()
    text = re.sub(r"[^a-z0-9äöüß]+", "-", text)
    return text.strip("-")


def stabile_id(quelle: str, quell_id: str | None, quell_url: str) -> str:
    """Erzeugt eine über Läufe hinweg stabile ID für eine Stelle."""
    basis = f"{quelle}:{quell_id or quell_url}"
    kurz = hashlib.sha1(basis.encode("utf-8")).hexdigest()[:10]
    return f"{slug(quelle)}:{quell_id or kurz}"


# Schlagwort -> Tätigkeitsfeld (Reihenfolge = Priorität; Spezifisches vor Allgemeinem).
_FELD_SCHLAGWORTE: list[tuple[tuple[str, ...], str]] = [
    (("turtle", "marine", "reef", "coral", "ocean", "seagrass", "whale", "dolphin",
      "fisher", "aquatic", "coast", "estuar", "kelp", "shark"), "Meeresschutz"),
    (("bird", "avian", "ornitho", "wildlife", "mammal", "fauna", "raptor", "wolf",
      "bat", "amphib", "reptile", "herp", "carnivore", "primate", "elephant", "lion",
      "ranger", "poach", "species", "habitat conservation", "zoo"), "Artenschutz/Tiere"),
    (("forest", "tree", "silvicult", "timber", "arborist", "woodland"), "Wald/Forst"),
    (("farm", "garden", "permacult", "agro", "agricultur", "orchard", "horticult",
      "veggie", "crop"), "Landwirtschaft/Permakultur"),
    (("educat", "outreach", "interpret", "teach", "youth", "school", "naturalist"),
     "Umweltbildung"),
    (("climate", "sustainab", "renewable", "carbon", "energy", "waste", "recycl"),
     "Klima/Nachhaltigkeit"),
    (("research", "field", "survey", "monitor", "data", "ecolog", "biolog", "botan",
      "plant", "flora", "vegetation", "lab ", "assistant", "technician"),
     "Forschung/Feldassistenz"),
    (("restoration", "habitat", "conservation", "steward", "wetland", "watershed",
      "trail", "invasive", "native", "land management", "park", "nature"), "Naturschutz"),
]


def feld_aus_text(text: str) -> str:
    """Heuristik: leitet ein Tätigkeitsfeld aus Titel/Beschreibung ab (Default Naturschutz).

    Nur ein grober Erstwert – die LLM-Stufe verfeinert die Felder später.
    """
    t = (text or "").lower()
    for schlagworte, feld in _FELD_SCHLAGWORTE:
        if any(s in t for s in schlagworte):
            return feld
    return "Naturschutz"


def normalize_taetigkeitsfelder(felder: Iterable[str]) -> list[str]:
    """Behält nur Werte aus dem kontrollierten Vokabular; Rest -> 'Sonstiges'."""
    ergebnis: list[str] = []
    for f in felder or []:
        if f in TAETIGKEITSFELDER:
            if f not in ergebnis:
                ergebnis.append(f)
        else:
            if "Sonstiges" not in ergebnis:
                ergebnis.append("Sonstiges")
    return ergebnis or ["Sonstiges"]
