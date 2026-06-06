"""Deduplizierung/Zusammenführung gleicher Stellen aus mehreren Quellen.

Schlüssel = (Organisation, Land, Titel), jeweils vereinheitlicht. Bei Duplikaten werden
die Quell-URLs gesammelt und das früheste ``erstmals_gesehen`` übernommen.
"""
from __future__ import annotations

from sources.base import slug


def dedup_key(rec: dict) -> str:
    return "|".join([
        slug(rec.get("organisation", "")),
        slug(rec.get("land", "")),
        slug(rec.get("titel", "")),
    ])


def _merge_two(basis: dict, weitere: dict) -> dict:
    """Führt ``weitere`` in ``basis`` zusammen (URLs sammeln, frühestes Datum)."""
    urls = list(basis.get("weitere_quell_urls") or [])
    for kandidat in [weitere.get("quell_url"), *(weitere.get("weitere_quell_urls") or [])]:
        if kandidat and kandidat != basis.get("quell_url") and kandidat not in urls:
            urls.append(kandidat)
    basis["weitere_quell_urls"] = urls

    # frühestes Erstsichtungsdatum behalten
    daten = [d for d in [basis.get("erstmals_gesehen"), weitere.get("erstmals_gesehen")] if d]
    if daten:
        basis["erstmals_gesehen"] = min(daten)

    # Felder, die im Basisdatensatz leer sind, aus dem Duplikat ergänzen
    for feld, wert in weitere.items():
        if feld in ("weitere_quell_urls", "erstmals_gesehen"):
            continue
        if basis.get(feld) in (None, "", []) and wert not in (None, "", []):
            basis[feld] = wert
    return basis


def merge(records: list[dict]) -> list[dict]:
    """Fasst Datensätze mit gleichem ``dedup_key`` zusammen, Reihenfolge bleibt stabil."""
    zusammengefasst: dict[str, dict] = {}
    reihenfolge: list[str] = []
    for rec in records:
        key = dedup_key(rec)
        if key in zusammengefasst:
            zusammengefasst[key] = _merge_two(zusammengefasst[key], rec)
        else:
            zusammengefasst[key] = dict(rec)
            reihenfolge.append(key)
    return [zusammengefasst[k] for k in reihenfolge]
