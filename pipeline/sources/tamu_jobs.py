"""Live-Scraper: Texas A&M Natural Resources Job Board (jobs.rwfm.tamu.edu).

Server-gerendert; jede Stelle ist ein ``<a class="list-group-item">`` mit Titel (``h6``),
Arbeitgeber (``p``) und Label/Wert-Zeilen (Location, Salary, Experience, Deadline …).
Eine Top-Quelle für **Feldassistenz, Saisonstellen, Praktika und Grad-Assistantships**
im Natur-/Wildtierbereich – oft mit Unterkunft/Stipendium.

robots.txt erlaubt ``/search/`` (Stand der Prüfung). Best-effort: Seiten/Quellen, die
ausfallen, werden übersprungen.
"""
from __future__ import annotations

import html as _html
import re
from datetime import datetime

from . import geo
from .base import feld_aus_text

QUELLE = "tamu-nr-jobs"
_BASIS = "https://jobs.rwfm.tamu.edu"
_SEITEN = 20  # je ~10 Stellen; Paginierung über ?pagenum=N


def fetch() -> list[dict]:
    from .http import hole

    gesehen: set[str] = set()
    treffer: list[dict] = []
    for seite in range(1, _SEITEN + 1):
        url = f"{_BASIS}/search/?pagenum={seite}"
        try:
            html = hole(url)
        except Exception as exc:  # noqa: BLE001 - Seite darf ausfallen
            print(f"  [skip] {QUELLE} S{seite}: {exc}")
            break
        neu = 0
        for roh in _parse(html):
            if roh["quell_id"] in gesehen:
                continue
            gesehen.add(roh["quell_id"])
            treffer.append(roh)
            neu += 1
        if neu == 0:  # keine neuen Stellen mehr -> Ende der Liste
            break
    return treffer


def _iso(text: str | None) -> str | None:
    if not text:
        return None
    for fmt in ("%m/%d/%Y", "%Y-%m-%d", "%b %d, %Y"):
        try:
            return datetime.strptime(text.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _ort(loc_raw: str) -> str:
    """Holt aus 'XXV2+R6 Fredonia, TX, USA (Fredonia, Texas)' den saubersten Ortsteil."""
    loc_raw = _html.unescape(loc_raw or "").strip()
    klammer = re.search(r"\(([^)]+)\)", loc_raw)
    if klammer:
        return klammer.group(1).strip()
    return re.sub(r"^[A-Z0-9]+\+[A-Z0-9]+\s*", "", loc_raw).strip()


def _parse(html: str) -> list[dict]:
    from selectolax.parser import HTMLParser

    baum = HTMLParser(html)
    ergebnis: list[dict] = []
    for a in baum.css("a.list-group-item"):
        ident = a.attributes.get("id") or ""
        m = re.search(r"job-(\d+)", ident)
        if not m:
            continue
        jid = m.group(1)
        h6 = a.css_first("h6")
        titel = h6.text(strip=True) if h6 else ""
        if not titel:
            continue
        p = a.css_first("p")
        organisation = (p.text(strip=True) if p else "") or "Texas A&M NR Job Board"

        roh_html = a.html or ""
        felder = {
            k.strip(): _html.unescape(v.strip())
            for k, v in re.findall(
                r'text-end">\s*([^<]+?):\s*</div>\s*<div[^>]*>\s*([^<]*?)\s*</div>', roh_html
            )
        }

        ort = _ort(felder.get("Location", ""))
        land, region, kont = geo.aufloesen(ort)
        if not land:
            titel_land, titel_region, titel_kont = geo.aufloesen(titel)
            if titel_land:
                land, region, kont = titel_land, titel_region, titel_kont

        teile = [f"{titel} bei {organisation}."]
        if felder.get("Salary"):
            teile.append(f"Vergütung: {felder['Salary']}.")
        if felder.get("Starting Date"):
            teile.append(f"Beginn: {felder['Starting Date']}.")

        ergebnis.append({
            "quelle": QUELLE,
            "quell_id": jid,
            "quell_url": f"{_BASIS}/view-job/?id={jid}",
            "titel": titel,
            "organisation": organisation,
            "land": land,
            "region": region,
            "kontinent": kont,
            "taetigkeitsfeld": [feld_aus_text(f"{titel} {organisation}")],
            "beschreibung": " ".join(teile),
            "bewerbungsfrist": _iso(felder.get("Application Deadline")),
            "_job_type": "",
            "_experience": (felder.get("Experience Required") or "").lower(),
            "_location_text": ort,
            "_kategorie": "tamu-natural-resources",
        })
    return ergebnis
