"""Deduplizierung/Zusammenführung gleicher Stellen aus mehreren Quellen.

Primärer Schlüssel = (Organisation, Land, Titel), jeweils vereinheitlicht. Zusätzlich werden
identische konkrete Quell-URLs zusammengeführt, falls eine Quelle denselben Detail-Link mit
leicht abweichendem Titel-/Organisationstext liefert. Bei Duplikaten werden die Quell-URLs
gesammelt und das früheste ``erstmals_gesehen`` übernommen.
"""
from __future__ import annotations

from sources.base import slug


def dedup_key(rec: dict) -> str:
    return "|".join([
        slug(rec.get("organisation", "")),
        slug(rec.get("land", "")),
        slug(rec.get("titel", "")),
    ])


def url_key(rec: dict) -> str | None:
    """Normalisiert konkrete Quell-URLs für einen zusätzlichen Duplikat-Abgleich."""
    url = (rec.get("quell_url") or "").strip().rstrip("/")
    if not url:
        return None
    return f"url|{url.lower()}"


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
    key_index: dict[str, str] = {}
    url_index: dict[str, str] = {}
    reihenfolge: list[str] = []
    for rec in records:
        roh_key = dedup_key(rec)
        key = key_index.get(roh_key, roh_key)
        ukey = url_key(rec)
        if ukey and ukey in url_index:
            key = url_index[ukey]
        if key in zusammengefasst:
            zusammengefasst[key] = _merge_two(zusammengefasst[key], rec)
        else:
            zusammengefasst[key] = dict(rec)
            reihenfolge.append(key)
        key_index[roh_key] = key
        if ukey:
            url_index[ukey] = key
    return [zusammengefasst[k] for k in reihenfolge]
