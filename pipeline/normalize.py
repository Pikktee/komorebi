"""Normalisierung: bildet lose Quell-Rohdaten auf das Zielschema ab.

Kernregeln (siehe datenmodell.md):
- ``kost_unterkunft_frei`` wird abgeleitet, wenn nicht gesetzt (Förderprogramm => True).
- ``kostenpflichtig`` ergibt sich aus einer vorhandenen Teilnahmegebühr.
- fehlende Felder werden mit sinnvollen Defaults gefüllt.
- ``id`` und Zeitstempel werden gesetzt, falls nicht vorhanden.
"""
from __future__ import annotations

from datetime import date

from sources.base import (
    PROGRAMME,
    PROGRAMME_MIT_FREIER_KOST,
    VORAUSSETZUNGEN_FELDER,
    normalize_taetigkeitsfelder,
    stabile_id,
)


def _voraussetzungen(raw: dict) -> dict:
    quelle = raw.get("voraussetzungen") or {}
    return {feld: quelle.get(feld) for feld in VORAUSSETZUNGEN_FELDER}


def normalize_record(raw: dict, heute: str | None = None) -> dict:
    """Wandelt einen Rohdatensatz in einen schema-konformen Datensatz um."""
    heute = heute or date.today().isoformat()

    quelle = raw.get("quelle") or "unbekannt"
    quell_url = raw.get("quell_url") or ""
    quell_id = raw.get("quell_id")

    programm = raw.get("programm") or "keins"
    if programm not in PROGRAMME:
        programm = "keins"

    teilnahmegebuehr = raw.get("teilnahmegebuehr_eur")

    # Ableitung: kostenpflichtig
    kostenpflichtig = raw.get("kostenpflichtig")
    if kostenpflichtig is None:
        kostenpflichtig = bool(teilnahmegebuehr and teilnahmegebuehr > 0)

    # Ableitung: kost_unterkunft_frei
    kost_frei = raw.get("kost_unterkunft_frei")
    if kost_frei is None:
        kost_frei = programm in PROGRAMME_MIT_FREIER_KOST

    rec = {
        "id": raw.get("id") or stabile_id(quelle, quell_id, quell_url),
        "titel": (raw.get("titel") or "").strip(),
        "organisation": (raw.get("organisation") or "").strip(),
        "aufnahmeorganisation": raw.get("aufnahmeorganisation"),
        "entsendeorganisation": raw.get("entsendeorganisation"),
        "land": (raw.get("land") or "").strip(),
        "region": raw.get("region"),
        "kontinent": (raw.get("kontinent") or "").strip(),
        "dauer_monate_min": raw.get("dauer_monate_min"),
        "dauer_monate_max": raw.get("dauer_monate_max"),
        "zeitraum_von": raw.get("zeitraum_von"),
        "zeitraum_bis": raw.get("zeitraum_bis"),
        "flexibler_start": bool(raw.get("flexibler_start", False)),
        "taetigkeitsfeld": normalize_taetigkeitsfelder(raw.get("taetigkeitsfeld")),
        "beschreibung": (raw.get("beschreibung") or "").strip(),
        "bewerbungsfrist": raw.get("bewerbungsfrist"),
        "voraussetzungen": _voraussetzungen(raw),
        "programm": programm,
        "kost_unterkunft_frei": bool(kost_frei),
        "kostenpflichtig": bool(kostenpflichtig),
        "teilnahmegebuehr_eur": teilnahmegebuehr,
        "taschengeld_eur_monat": raw.get("taschengeld_eur_monat"),
        "reisekosten_erstattet": raw.get("reisekosten_erstattet"),
        "versicherung": raw.get("versicherung"),
        "sprachkurs": raw.get("sprachkurs"),
        "quelle": quelle,
        "quell_url": quell_url,
        "weitere_quell_urls": list(raw.get("weitere_quell_urls") or []),
        "quell_id": quell_id,
        "erstmals_gesehen": raw.get("erstmals_gesehen") or heute,
        "zuletzt_gesehen": heute,
        "zuletzt_geaendert": raw.get("zuletzt_geaendert") or heute,
    }
    return rec
