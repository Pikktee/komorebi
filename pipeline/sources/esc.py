"""Live-Scraper: Europäisches Solidaritätskorps (youth.europa.eu).

Das EU-Jugendportal stellt offene ESC-Freiwilligenstellen über eine öffentliche
Elasticsearch-Suchschnittstelle bereit (``/api/rest/eyp/v1/search``). Genau diese ruft
auch die React-Suche der Seite auf. Wir fragen dieselbe Abfrage ab wie das Frontend:

  type=Opportunity, status=open, funding_programme=alle ESC-Programme,
  esc_topics=natr (Umwelt & Naturschutz), Bewerbungsfrist noch offen oder ohne Frist.

So liefert eine einzige Quelle *geförderte* Freiwilligendienste aus ~50 Ländern – jeweils
mit freier Kost & Unterkunft (ESC-Standard), was die Pipeline über ``programm="ESC"``
automatisch ableitet (siehe ``normalize``/``base.PROGRAMME_MIT_FREIER_KOST``).

Das deterministische ``esc_topics=natr`` ist nur eine Vorauswahl; viele Stellen taggen
mehrere Themen. Das *subtile* Rauschen (fachfremde Sozialprojekte, die „natr" mit-taggen)
sortiert die LLM-Stufe anhand der Beschreibung aus – wie bei den übrigen Live-Quellen.

robots.txt erlaubt ``/api/`` (Stand der Prüfung). Best-effort: Eine fehlerhafte Seite
beendet die Paginierung, der Rest bleibt erhalten.
"""
from __future__ import annotations

import json
import re
import time
import urllib.parse
from datetime import date

from . import base, geo

QUELLE = "esc"
_BASIS = "https://youth.europa.eu"
_API = f"{_BASIS}/api/rest/eyp/v1/search_en"

# Alle ESC-Förderprogramm-IDs (wie in der Frontend-Konfiguration der Suche).
_FOERDERPROGRAMME = ["5", "4", "3", "2", "1", "8", "6", "7"]
# ESC-Themencode für „Umwelt & Naturschutz".
_THEMA_NATUR = "natr"

_SEITE = 50          # Treffer pro API-Aufruf
_MAX_TREFFER = 600   # Sicherheitsobergrenze (~452 Naturstellen Stand der Prüfung)
# youth.europa.eu drosselt sporadisch mit 429 (ohne Retry-After-Header), geteilte
# CI-IPs deutlich härter als Wohn-IPs. Darum geduldiger als bei den HTML-Quellen.
_VERSUCHE = 6        # Wiederholungen bei 429/Netzfehler
_BACKOFF_S = 8.0     # Basis-Wartezeit für den Backoff (verdoppelt sich je Versuch)
_BACKOFF_MAX_S = 45.0  # Obergrenze je Wartephase (sonst läuft der Backoff davon)


def _query(size: int, frm: int, heute: str) -> dict:
    """Baut die Abfrage im Vokabular der ESC-Suche (entspricht ``defaultQuery``)."""
    return {
        "type": "Opportunity",
        "size": size,
        "from": frm,
        "filters": {
            "status": "open",
            "date_end": {"operator": ">=", "value": heute, "type": "must"},
            "funding_programme": {"id": _FOERDERPROGRAMME},
            "esc_topics": [_THEMA_NATUR],
            # Bewerbungsfrist offen ODER keine Frist (Gruppe "deadline" = ODER-verknüpft).
            "date_application_end": {"operator": ">=", "value": heute,
                                     "type": "must", "group": "deadline"},
            "has_no_deadline": {"value": True, "type": "must", "group": "deadline"},
        },
    }


def _serialisiere(obj, prefix: str | None = None) -> list[tuple[str, str]]:
    """Serialisiert ein verschachteltes dict/list wie ``qs.stringify`` (Frontend-Default)."""
    paare: list[tuple[str, str]] = []
    if isinstance(obj, dict):
        for schluessel, wert in obj.items():
            key = f"{prefix}[{schluessel}]" if prefix else str(schluessel)
            paare += _serialisiere(wert, key)
    elif isinstance(obj, list):
        for i, wert in enumerate(obj):
            paare += _serialisiere(wert, f"{prefix}[{i}]")
    else:
        if isinstance(obj, bool):
            obj = "true" if obj else "false"
        paare.append((prefix or "", str(obj)))
    return paare


def _hole_seite(url: str) -> dict | None:
    """Lädt eine API-Seite mit Backoff bei 429/Netzfehler. ``None`` = endgültig fehlgeschlagen."""
    from .http import hole

    for versuch in range(_VERSUCHE):
        try:
            return json.loads(hole(url))
        except Exception as exc:  # noqa: BLE001 - Quelle darf den Build nicht kippen
            ist_429 = "429" in str(exc)
            if versuch + 1 >= _VERSUCHE or not ist_429:
                print(f"  [skip] {QUELLE}: {exc}")
                return None
            wartezeit = min(_BACKOFF_S * (2 ** versuch), _BACKOFF_MAX_S)
            print(f"  [retry] {QUELLE}: 429 – warte {wartezeit:.0f}s "
                  f"(Versuch {versuch + 1}/{_VERSUCHE}) …")
            time.sleep(wartezeit)
    return None


def fetch() -> list[dict]:
    heute = date.today().isoformat()
    gesehen: set[str] = set()
    treffer: list[dict] = []

    for frm in range(0, _MAX_TREFFER, _SEITE):
        params = _serialisiere(_query(_SEITE, frm, heute))
        url = f"{_API}?{urllib.parse.urlencode(params)}"
        payload = _hole_seite(url)
        if payload is None:
            break

        neu = 0
        for record in _parse(payload, heute=heute):
            if record["quell_id"] in gesehen:
                continue
            gesehen.add(record["quell_id"])
            treffer.append(record)
            neu += 1
        if neu == 0:
            break

        total = (payload.get("hits") or {}).get("total") or {}
        if frm + _SEITE >= (total.get("value") or 0):
            break

    return treffer


def _datum(wert) -> str | None:
    """Schneidet ein ISO-Datetime ("2026-09-01T12:00:00") auf das reine Datum zu."""
    if not isinstance(wert, str):
        return None
    kurz = wert.strip()[:10]
    return kurz if re.match(r"\d{4}-\d{2}-\d{2}$", kurz) else None


def _beschreibung(quelle: dict, land: str) -> str:
    roh = re.sub(r"\s+", " ", (quelle.get("description") or "").strip())
    if len(roh) > 600:
        roh = roh[:600].rsplit(" ", 1)[0] + " …"
    ort = ", ".join(x for x in [(quelle.get("town") or "").strip(), land] if x)
    kopf = "Geförderter Freiwilligendienst im Europäischen Solidaritätskorps (ESC)"
    if ort:
        kopf += f" in {ort}"
    kopf += "."
    return f"{kopf} {roh}".strip()


def _parse(payload: dict, heute: str | None = None) -> list[dict]:
    """Wandelt eine ES-Antwort in lose Roh-Datensätze (testbar ohne Netz)."""
    hits = ((payload or {}).get("hits") or {}).get("hits") or []
    ergebnis: list[dict] = []
    for hit in hits:
        quelle = hit.get("_source") or {}
        opid = quelle.get("opid") or quelle.get("id") or hit.get("_id")
        titel = (quelle.get("title") or "").strip()
        if not opid or not titel:
            continue

        land, region, kontinent = geo.aus_laendercode(quelle.get("country"))
        town = (quelle.get("town") or "").strip()
        if town and not region:
            region = town

        organisation = (quelle.get("organisation_name") or "").strip() \
            or "Europäisches Solidaritätskorps"
        feld = base.feld_aus_text(f"{titel} {quelle.get('description') or ''}")
        ohne_frist = bool(quelle.get("has_no_deadline"))

        ergebnis.append({
            "quelle": QUELLE,
            "quell_id": str(opid),
            "quell_url": f"{_BASIS}/solidarity/opportunity/{opid}_en",
            "titel": titel,
            "organisation": organisation,
            "aufnahmeorganisation": organisation,
            "land": land,
            "region": region,
            "kontinent": kontinent,
            "programm": "ESC",
            "zeitraum_von": _datum(quelle.get("date_start")),
            "zeitraum_bis": _datum(quelle.get("date_end")),
            "flexibler_start": quelle.get("date_flexibility") == "flexible",
            "bewerbungsfrist": None if ohne_frist else _datum(quelle.get("date_application_end")),
            "taetigkeitsfeld": [feld],
            "beschreibung": _beschreibung(quelle, land),
            # ESC-Volunteering ist 18–30 (Programm-Regel).
            "voraussetzungen": {"mindestalter": 18, "hoechstalter": 30,
                                "sprache": None, "vorkenntnisse": None},
            # Helfer-Felder für die Eignungsprüfung (landen nie im Schema-Output):
            "_job_type": "volunteer",
            "_location_text": town,
            "_kategorie": "esc-volunteering",
        })
    return ergebnis
