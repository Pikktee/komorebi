"""Live-Scraper: Conservation Job Board (conservationjobboard.com).

Die Seite ist server-gerendert und legt je Listing strukturierte Attribute auf den
Titel-Link (``job_type``, ``location``, ``experience``, ``categories`` …) – ideal, um
unpassende Festanstellungen schon hier zu erkennen und den Ort sauber aufzulösen.

robots.txt erlaubt die Kategorieseiten (Stand der Prüfung: nur ``/*mailto:`` ist gesperrt).
Best-effort: Jede Kategorie, die ausfällt, wird übersprungen, der Rest läuft weiter.
"""
from __future__ import annotations

from datetime import datetime

from . import geo

QUELLE = "conservation-job-board"
_BASIS = "https://www.conservationjobboard.com"

# Kategorieseite -> Standard-Tätigkeitsfeld (robust, ohne den Mehrfach-Attribut-Slug zu zerlegen)
KATEGORIEN: dict[str, str] = {
    "ecology-jobs": "Forschung/Feldassistenz",
    "wildlife-jobs": "Artenschutz/Tiere",
    "marine-biology-jobs": "Meeresschutz",
    "fisheries-jobs": "Meeresschutz",
    "botany-jobs": "Forschung/Feldassistenz",
    "forestry-jobs": "Wald/Forst",
    "restoration-jobs": "Naturschutz",
    "environmental-education-jobs": "Umweltbildung",
    "general-and-stewardship-jobs": "Naturschutz",
    "sustainability-jobs": "Klima/Nachhaltigkeit",
}

_ART_LABEL = {
    "temporary": "Saison-/Zeitstelle",
    "seasonal": "Saisonstelle",
    "internship": "Praktikum",
    "paid-internship": "bezahltes Praktikum",
    "unpaid-internship": "Praktikum",
    "volunteer": "Freiwilligenstelle",
    "americorps": "AmeriCorps-Programm",
    "fellowship": "Fellowship",
    "student": "studentische Stelle",
    "faculty-postdoc": "Postdoc/Faculty",
    "permanent": "Festanstellung",
}


def fetch() -> list[dict]:
    from .http import hole

    gesehen: set[str] = set()
    treffer: list[dict] = []
    for slug, feld in KATEGORIEN.items():
        url = f"{_BASIS}/category/{slug}"
        try:
            html = hole(url)
        except Exception as exc:  # noqa: BLE001 - einzelne Kategorie darf ausfallen
            print(f"  [skip] {QUELLE}/{slug}: {exc}")
            continue
        for roh in _parse(html, feld, slug):
            schluessel = roh.get("quell_id") or roh.get("quell_url")
            if schluessel in gesehen:
                continue
            gesehen.add(schluessel)
            treffer.append(roh)
    return treffer


def _intro_felder(knoten) -> dict[str, str]:
    """Liest die ``<p class="listing__job__intro">``-Zeilen als ``{Label: Wert}``."""
    felder: dict[str, str] = {}
    for p in knoten.css("p.listing__job__intro"):
        span = p.css_first("span")
        if not span:
            continue
        label = span.text(strip=True).rstrip(":")
        voll = p.text(strip=True)
        wert = voll[len(span.text(strip=True)):]
        wert = wert.lstrip(" :\xa0\t").replace("\xa0", " ").strip()
        if label and wert:
            felder[label] = wert
    return felder


def _deadline_iso(text: str) -> str | None:
    for fmt in ("%b %d, %Y", "%B %d, %Y", "%d %b %Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(text.strip(), fmt).date().isoformat()
        except ValueError:
            continue
    return None


def _parse(html: str, feld: str, kategorie: str) -> list[dict]:
    from selectolax.parser import HTMLParser

    baum = HTMLParser(html)
    ergebnis: list[dict] = []
    for art in baum.css("article"):
        a = art.css_first("h2.listing__job__title a") or art.css_first("a.gtag-job-link")
        if not a:
            continue
        titel = a.text(strip=True)
        href = a.attributes.get("href") or ""
        if not titel or not href:
            continue
        attr = a.attributes
        job_type = (attr.get("job_type") or "").strip().lower()
        experience = (attr.get("experience") or "").strip().lower()
        location_slug = (attr.get("location") or "").strip()
        quell_id = attr.get("job_id") or attr.get("data-job-code")

        org_node = art.css_first("h3")
        ort_node = art.css_first("h4")
        organisation = org_node.text(strip=True) if org_node else "Conservation Job Board"
        ort_text = ort_node.text(strip=True) if ort_node else ""

        land, region, kontinent = geo.aufloesen(ort_text)
        if not land and location_slug:
            land, region, kontinent = geo.aufloesen(location_slug)

        intro = _intro_felder(art)
        verguetung = intro.get("Salary")
        frist = _deadline_iso(intro.get("Deadline", "")) if intro.get("Deadline") else None

        art_label = _ART_LABEL.get(job_type, "Stelle")
        teile = [f"{art_label} im Bereich {feld} bei {organisation}."]
        if verguetung:
            teile.append(f"Vergütung: {verguetung}.")
        beschreibung = " ".join(teile)

        ergebnis.append({
            "quelle": QUELLE,
            "quell_id": quell_id,
            "quell_url": href if href.startswith("http") else f"{_BASIS}{href}",
            "titel": titel,
            "organisation": organisation,
            "land": land,
            "region": region,
            "kontinent": kontinent,
            "taetigkeitsfeld": [feld],
            "beschreibung": beschreibung,
            "bewerbungsfrist": frist,
            # Helfer-Felder für Eignungsprüfung/LLM (werden nicht ins Schema übernommen):
            "_job_type": job_type,
            "_experience": experience,
            "_location_text": ort_text,
            "_kategorie": kategorie,
        })
    return ergebnis
