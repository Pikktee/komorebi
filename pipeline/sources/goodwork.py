"""Live-Scraper: GoodWork.ca Volunteer-Angebote.

GoodWork ist eine server-gerenderte kanadische Umwelt-/Volunteer-Börse. robots.txt erlaubt
die Listen- und Detailseiten; die Terms enthalten kein ausdrückliches Bot-/Scraping-Verbot
(Stand der Prüfung: 2026-06-06). Wir lesen nur die öffentlichen Listen sparsam aus und
übernehmen ausschließlich Einträge mit erkennbarem ökologischem Bezug.
"""
from __future__ import annotations

import html as _html
import re

from . import geo
from .base import feld_aus_text

QUELLE = "goodwork"
_BASIS = "https://www.goodwork.ca"
_SEITEN = 3

_RELEVANZ = (
    "nature", "conservation", "environment", "environmental", "ecology", "ecological",
    "eco", "climate", "sustainab", "wildlife", "biodiversity", "species", "habitat",
    "restoration", "steward", "park", "parks", "garden", "gardening", "farm",
    "farming", "organic", "permaculture", "agro", "food", "grow", "soil", "forest",
    "trail", "land trust", "watershed", "river", "lake", "marine", "coast", "science",
    "butterfly", "pollinator", "recycling", "regenerative",
)
_AUSSCHLUSS = (
    "treasurer", "board member", "board members", "board director", "directors",
    "fundraising", "fundraiser", "finance", "accounting", "film festival",
    "graphic design", "social media", "book club", "repair café", "repair cafe",
    "peace", "war crimes",
)
_STARKE_RELEVANZ = (
    "conservation", "ecological", "restoration", "wildlife", "biodiversity",
    "nature steward", "parks", "organic", "farm", "permaculture", "regenerative",
    "butterfly", "pollinator", "science communication", "climate",
)
_GENERISCHE_TITEL = (
    "environmental volunteer opportunities",
    "wildlife conservation organizations",
    "organic farms & gardens across canada",
    "women in science",
    "toronto climate week",
    "sustainability team",
)
_GENERISCHE_TITEL_EXAKT = {
    "grow food",
    "indigenous peoples, first nations and the environment",
    "hands-on training in deconstruction, material recovery, circular construction",
    "learn how to grow food",
    "learn to grow your own food",
    "take action",
    "take action for climate & environment",
    "volunteers",
    "community workshop assistants",
    "co-op worker members",
}
_UNPASSENDE_TITEL_TEILE = (
    "eco-lodge",
    "eco lodge",
    "art studio",
    "book club",
    "care providers",
    "deconstruction",
    "wildfires, smoke, climate crisis",
)


def fetch() -> list[dict]:
    from .http import hole

    treffer: list[dict] = []
    gesehen: set[str] = set()
    for seite in range(1, _SEITEN + 1):
        url = f"{_BASIS}/volunteer" if seite == 1 else f"{_BASIS}/jobs.php?level=vol&page={seite}"
        try:
            html = hole(url)
        except Exception as exc:  # noqa: BLE001 - einzelne Seite darf ausfallen
            print(f"  [skip] {QUELLE} S{seite}: {exc}")
            break
        neu = 0
        for roh in _parse(html):
            if roh["quell_id"] in gesehen:
                continue
            gesehen.add(roh["quell_id"])
            treffer.append(roh)
            neu += 1
        if neu == 0:
            break
    return treffer


def _sauber(text: str) -> str:
    text = _html.unescape(text or "")
    text = re.sub(r"\s+", " ", text)
    return text.strip(" \t\r\n,;")


def _relevant(text: str) -> bool:
    t = text.lower()
    if any(w in t for w in _GENERISCHE_TITEL):
        return False
    if not any(w in t for w in _RELEVANZ):
        return False
    if any(w in t for w in _AUSSCHLUSS) and not any(w in t for w in _STARKE_RELEVANZ):
        return False
    return True


def _generischer_oder_unpassender_titel(titel: str) -> bool:
    t = titel.lower()
    return t in _GENERISCHE_TITEL_EXAKT or any(w in t for w in _UNPASSENDE_TITEL_TEILE)


def _typ_segment(segment: str) -> bool:
    t = segment.lower()
    if re.search(
        r"\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec|spring|summer|fall|winter|"
        r"monday|tuesday|wednesday|thursday|friday|saturday|sunday|"
        r"mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays)\b",
        t,
    ):
        return True
    return any(
        w in t
        for w in (
            "vol", "free", "accom", "food", "meal", "stipend", "intern", "apprentice",
            "workstay", "work exchange", "program", "position", "month", "week", "ages",
            "single", "couple", "live on-site", "on-site", "experience",
        )
    )


def _organisation_und_ort(rest: str) -> tuple[str, str]:
    teile = [_sauber(p) for p in rest.split(",") if _sauber(p)]
    if not teile:
        return ("GoodWork.ca", "")

    idx = 0
    while idx < len(teile) and _typ_segment(teile[idx]):
        idx += 1
    if idx >= len(teile):
        return ("GoodWork.ca", ", ".join(teile))

    organisation = teile[idx]
    ort = ", ".join(teile[idx + 1:])
    return (organisation or "GoodWork.ca", ort)


def _id_aus_url(url: str) -> str:
    m = re.search(r"-(\d+)(?:$|[/?#])", url)
    if m:
        return m.group(1)
    return url.rstrip("/").rsplit("/", 1)[-1]


def _geo_goodwork(ort_text: str, voll: str) -> tuple[str, str | None, str]:
    ort = re.sub(r"\([^)]*\)", "", ort_text or "")
    ort = re.sub(r"\b(anywhere|remote|virtual|vitual|near|around|in|at)\b", " ", ort, flags=re.I)
    ort = ort.replace(" / ", ", ").replace("/", ", ")
    ort_norm = ort.lower()
    if any(w in ort_norm for w in (
        "vancouver island", "north vancouver island", "salt spring island", "galiano island",
        "haida gwaii", "british columbia", " bc", "bc ",
    )):
        return ("Kanada", _sauber(ort), "Nordamerika")

    land, region, kontinent = geo.aufloesen(ort)
    if land:
        return (land, region, kontinent)

    voll_land, _, voll_kontinent = geo.aufloesen(voll)
    if voll_land and voll_land != "Kanada":
        return (voll_land, region, voll_kontinent)

    if ort.strip() and not any(w in ort.lower() for w in ("worldwide", "remote", "anywhere")):
        return ("Kanada", _sauber(ort), "Nordamerika")
    return ("", region, "")


def _parse(html: str) -> list[dict]:
    from selectolax.parser import HTMLParser

    baum = HTMLParser(html)
    ergebnis: list[dict] = []
    for row in baum.css("div.listingthumb"):
        span = row.css_first("div.eight span")
        a = span.css_first("a") if span else None
        if not span or not a:
            continue
        titel = _sauber(a.text(strip=True))
        href = a.attributes.get("href") or ""
        if not titel or not href:
            continue
        if _generischer_oder_unpassender_titel(titel):
            continue

        voll = _sauber(span.text(separator=" ", strip=True))
        if not _relevant(voll):
            continue

        rest = _sauber(voll[len(titel):]) if voll.lower().startswith(titel.lower()) else voll
        organisation, ort_text = _organisation_und_ort(rest)
        land, region, kontinent = _geo_goodwork(ort_text, voll)

        quell_url = href if href.startswith("http") else f"{_BASIS}{href}"
        beschreibung = f"GoodWork-Volunteer-Eintrag: {rest or voll}."
        kost_frei = any(w in voll.lower() for w in ("accom", "food", "meal", "live on-site"))
        kostenpflichtig = "program fee" in voll.lower()

        ergebnis.append({
            "quelle": QUELLE,
            "quell_id": _id_aus_url(href),
            "quell_url": quell_url,
            "titel": titel,
            "organisation": organisation,
            "land": land,
            "region": region,
            "kontinent": kontinent,
            "taetigkeitsfeld": [feld_aus_text(voll)],
            "beschreibung": beschreibung,
            "kost_unterkunft_frei": kost_frei,
            "kostenpflichtig": kostenpflichtig,
            "_job_type": "volunteer",
            "_experience": "",
            "_location_text": ort_text,
            "_kategorie": "goodwork-volunteer",
        })
    return ergebnis
