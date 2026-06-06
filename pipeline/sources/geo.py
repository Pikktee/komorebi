"""Ortsdatenbank (Gazetteer) + Heuristik: Ortstext -> (Land, Region, Kontinent).

Viele Quellen liefern den Ort nur als freien Text ("Dixon, CA"), als Slug
("south-carolina") oder als Ländername ("Costa Rica"). Diese Funktion normalisiert das
deterministisch auf saubere deutsche Ländernamen und einen Kontinent aus
``base.KONTINENTE`` – ganz ohne Netz/Abhängigkeiten, damit sie überall testbar ist.

Vorgehen (Heuristik):
1. Platzhalter ("Remote", "Various" …) -> kein Land.
2. Der Text wird an Kommas zerlegt; die Tokens werden von hinten nach vorne geprüft
   (das Spezifischste – meist Bundesstaat/Land – steht hinten).
3. Treffer gegen US-Bundesstaaten, kanadische Provinzen, UK-Teile, AU-Staaten und die
   Länder-Tabelle. Was davor steht, wird als Region (Stadt) übernommen.
"""
from __future__ import annotations

import re

# --- US-Bundesstaaten (Abkürzung + Name) -> alle als "USA" --------------------------
_US_STATES = {
    "al": "Alabama", "ak": "Alaska", "az": "Arizona", "ar": "Arkansas",
    "ca": "Kalifornien", "co": "Colorado", "ct": "Connecticut", "de": "Delaware",
    "fl": "Florida", "ga": "Georgia", "hi": "Hawaii", "id": "Idaho", "il": "Illinois",
    "in": "Indiana", "ia": "Iowa", "ks": "Kansas", "ky": "Kentucky", "la": "Louisiana",
    "me": "Maine", "md": "Maryland", "ma": "Massachusetts", "mi": "Michigan",
    "mn": "Minnesota", "ms": "Mississippi", "mo": "Missouri", "mt": "Montana",
    "ne": "Nebraska", "nv": "Nevada", "nh": "New Hampshire", "nj": "New Jersey",
    "nm": "New Mexico", "ny": "New York", "nc": "North Carolina", "nd": "North Dakota",
    "oh": "Ohio", "ok": "Oklahoma", "or": "Oregon", "pa": "Pennsylvania",
    "ri": "Rhode Island", "sc": "South Carolina", "sd": "South Dakota",
    "tn": "Tennessee", "tx": "Texas", "ut": "Utah", "vt": "Vermont", "va": "Virginia",
    "wa": "Washington", "wv": "West Virginia", "wi": "Wisconsin", "wy": "Wyoming",
    "dc": "District of Columbia", "pr": "Puerto Rico",
}
# vollständige Bundesstaat-Namen (englisch, normalisiert) ebenfalls erkennen
_US_STATE_NAMES = {
    "alabama", "alaska", "arizona", "arkansas", "california", "colorado",
    "connecticut", "delaware", "florida", "hawaii", "idaho", "illinois", "indiana",
    "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts",
    "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska",
    "nevada", "new hampshire", "new jersey", "new mexico", "new york",
    "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania",
    "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah",
    "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming",
    "district of columbia", "puerto rico",
}

_CA_PROVINZEN = {
    "alberta", "british columbia", "manitoba", "new brunswick", "newfoundland",
    "newfoundland and labrador", "nova scotia", "ontario", "quebec", "québec",
    "saskatchewan", "yukon", "nunavut", "northwest territories", "prince edward island",
    "bc", "ab", "on", "qc", "ns", "nb", "mb", "sk", "pe", "nl", "nt", "nu", "yt",
}

_UK_TEILE = {
    "uk", "u k", "united kingdom", "great britain", "england", "scotland", "wales",
    "northern ireland", "schottland", "wales ", "vereinigtes koenigreich",
}

_AU_STAATEN = {
    "new south wales", "victoria", "queensland", "tasmania", "south australia",
    "western australia", "northern territory", "nsw", "qld", "vic", "tas", "wa-au",
}

# --- Länder-Tabelle: (deutscher Name, Kontinent, [Aliase ...]) -----------------------
# Kontinente gemäß base.KONTINENTE. Mittelamerika/Karibik zählen geografisch zu Nordamerika.
_LAENDER_ROH: list[tuple[str, str, list[str]]] = [
    # Europa
    ("Deutschland", "Europa", ["germany", "deutschland", "de-de"]),
    ("Österreich", "Europa", ["austria", "oesterreich", "osterreich"]),
    ("Schweiz", "Europa", ["switzerland", "schweiz", "suisse"]),
    ("Frankreich", "Europa", ["france", "frankreich"]),
    ("Spanien", "Europa", ["spain", "spanien", "espana", "españa"]),
    ("Portugal", "Europa", ["portugal"]),
    ("Italien", "Europa", ["italy", "italien", "italia"]),
    ("Griechenland", "Europa", ["greece", "griechenland", "hellas"]),
    ("Vereinigtes Königreich", "Europa", ["united kingdom", "uk", "great britain",
        "england", "scotland", "wales", "northern ireland", "britain"]),
    ("Irland", "Europa", ["ireland", "irland", "eire"]),
    ("Niederlande", "Europa", ["netherlands", "niederlande", "holland", "the netherlands"]),
    ("Belgien", "Europa", ["belgium", "belgien"]),
    ("Luxemburg", "Europa", ["luxembourg", "luxemburg"]),
    ("Dänemark", "Europa", ["denmark", "daenemark", "danemark"]),
    ("Schweden", "Europa", ["sweden", "schweden", "sverige"]),
    ("Norwegen", "Europa", ["norway", "norwegen", "norge"]),
    ("Finnland", "Europa", ["finland", "finnland", "suomi"]),
    ("Island", "Europa", ["iceland", "island"]),
    ("Polen", "Europa", ["poland", "polen", "polska"]),
    ("Tschechien", "Europa", ["czech republic", "czechia", "tschechien"]),
    ("Slowakei", "Europa", ["slovakia", "slowakei"]),
    ("Ungarn", "Europa", ["hungary", "ungarn", "magyarorszag"]),
    ("Slowenien", "Europa", ["slovenia", "slowenien"]),
    ("Kroatien", "Europa", ["croatia", "kroatien", "hrvatska"]),
    ("Serbien", "Europa", ["serbia", "serbien"]),
    ("Bosnien und Herzegowina", "Europa", ["bosnia", "bosnia and herzegovina", "bosnien"]),
    ("Montenegro", "Europa", ["montenegro"]),
    ("Albanien", "Europa", ["albania", "albanien"]),
    ("Nordmazedonien", "Europa", ["north macedonia", "macedonia", "nordmazedonien"]),
    ("Bulgarien", "Europa", ["bulgaria", "bulgarien"]),
    ("Rumänien", "Europa", ["romania", "rumaenien", "rumanien"]),
    ("Estland", "Europa", ["estonia", "estland"]),
    ("Lettland", "Europa", ["latvia", "lettland"]),
    ("Litauen", "Europa", ["lithuania", "litauen"]),
    ("Ukraine", "Europa", ["ukraine"]),
    ("Moldau", "Europa", ["moldova", "moldau"]),
    ("Russland", "Europa", ["russia", "russland", "russian federation"]),
    ("Zypern", "Europa", ["cyprus", "zypern"]),
    ("Malta", "Europa", ["malta"]),
    # Afrika
    ("Südafrika", "Afrika", ["south africa", "suedafrika", "sudafrika", "rsa"]),
    ("Namibia", "Afrika", ["namibia"]),
    ("Botswana", "Afrika", ["botswana", "botsuana"]),
    ("Simbabwe", "Afrika", ["zimbabwe", "simbabwe"]),
    ("Sambia", "Afrika", ["zambia", "sambia"]),
    ("Mosambik", "Afrika", ["mozambique", "mosambik"]),
    ("Kenia", "Afrika", ["kenya", "kenia"]),
    ("Tansania", "Afrika", ["tanzania", "tansania", "zanzibar", "sansibar"]),
    ("Uganda", "Afrika", ["uganda"]),
    ("Ruanda", "Afrika", ["rwanda", "ruanda"]),
    ("Äthiopien", "Afrika", ["ethiopia", "aethiopien", "athiopien"]),
    ("Ghana", "Afrika", ["ghana"]),
    ("Senegal", "Afrika", ["senegal"]),
    ("Gambia", "Afrika", ["gambia"]),
    ("Nigeria", "Afrika", ["nigeria"]),
    ("Kamerun", "Afrika", ["cameroon", "kamerun"]),
    ("Marokko", "Afrika", ["morocco", "marokko"]),
    ("Tunesien", "Afrika", ["tunisia", "tunesien"]),
    ("Ägypten", "Afrika", ["egypt", "aegypten", "agypten"]),
    ("Madagaskar", "Afrika", ["madagascar", "madagaskar"]),
    ("Seychellen", "Afrika", ["seychelles", "seychellen"]),
    ("Malawi", "Afrika", ["malawi"]),
    # Asien
    ("Indien", "Asien", ["india", "indien"]),
    ("Nepal", "Asien", ["nepal"]),
    ("Sri Lanka", "Asien", ["sri lanka", "srilanka"]),
    ("Thailand", "Asien", ["thailand"]),
    ("Vietnam", "Asien", ["vietnam"]),
    ("Kambodscha", "Asien", ["cambodia", "kambodscha"]),
    ("Laos", "Asien", ["laos"]),
    ("Indonesien", "Asien", ["indonesia", "indonesien", "bali", "borneo", "sumatra"]),
    ("Malaysia", "Asien", ["malaysia", "borneo malaysia"]),
    ("Philippinen", "Asien", ["philippines", "philippinen"]),
    ("China", "Asien", ["china"]),
    ("Japan", "Asien", ["japan"]),
    ("Südkorea", "Asien", ["south korea", "suedkorea", "korea"]),
    ("Mongolei", "Asien", ["mongolia", "mongolei"]),
    ("Bangladesch", "Asien", ["bangladesh", "bangladesch"]),
    ("Myanmar", "Asien", ["myanmar", "burma"]),
    ("Israel", "Asien", ["israel"]),
    ("Jordanien", "Asien", ["jordan", "jordanien"]),
    ("Türkei", "Asien", ["turkey", "tuerkei", "turkei", "tuerkiye"]),
    # Nordamerika (inkl. Mittelamerika & Karibik)
    ("USA", "Nordamerika", ["usa", "united states", "united states of america",
        "u s a", "us", "america"]),
    ("Kanada", "Nordamerika", ["canada", "kanada"]),
    ("Mexiko", "Nordamerika", ["mexico", "mexiko"]),
    ("Costa Rica", "Nordamerika", ["costa rica", "costarica"]),
    ("Panama", "Nordamerika", ["panama"]),
    ("Guatemala", "Nordamerika", ["guatemala"]),
    ("Honduras", "Nordamerika", ["honduras"]),
    ("Nicaragua", "Nordamerika", ["nicaragua"]),
    ("Belize", "Nordamerika", ["belize"]),
    ("El Salvador", "Nordamerika", ["el salvador"]),
    ("Kuba", "Nordamerika", ["cuba", "kuba"]),
    ("Dominikanische Republik", "Nordamerika", ["dominican republic", "dominikanische"]),
    ("Jamaika", "Nordamerika", ["jamaica", "jamaika"]),
    ("Bahamas", "Nordamerika", ["bahamas"]),
    ("Trinidad und Tobago", "Nordamerika", ["trinidad", "trinidad and tobago"]),
    # Südamerika
    ("Brasilien", "Südamerika", ["brazil", "brasilien", "brasil"]),
    ("Argentinien", "Südamerika", ["argentina", "argentinien"]),
    ("Chile", "Südamerika", ["chile"]),
    ("Peru", "Südamerika", ["peru"]),
    ("Ecuador", "Südamerika", ["ecuador", "galapagos", "galápagos"]),
    ("Kolumbien", "Südamerika", ["colombia", "kolumbien"]),
    ("Bolivien", "Südamerika", ["bolivia", "bolivien"]),
    ("Paraguay", "Südamerika", ["paraguay"]),
    ("Uruguay", "Südamerika", ["uruguay"]),
    ("Venezuela", "Südamerika", ["venezuela"]),
    ("Guyana", "Südamerika", ["guyana"]),
    ("Suriname", "Südamerika", ["suriname"]),
    # Ozeanien
    ("Australien", "Ozeanien", ["australia", "australien"]),
    ("Neuseeland", "Ozeanien", ["new zealand", "neuseeland", "aotearoa"]),
    ("Fidschi", "Ozeanien", ["fiji", "fidschi"]),
    ("Papua-Neuguinea", "Ozeanien", ["papua new guinea", "papua-neuguinea"]),
    ("Samoa", "Ozeanien", ["samoa"]),
    ("Tonga", "Ozeanien", ["tonga"]),
    ("Vanuatu", "Ozeanien", ["vanuatu"]),
    ("Salomonen", "Ozeanien", ["solomon islands", "salomonen"]),
]

# Alias -> (Land, Kontinent)
_LAND_INDEX: dict[str, tuple[str, str]] = {}
for _name, _kont, _aliase in _LAENDER_ROH:
    for _a in _aliase:
        _LAND_INDEX[_a] = (_name, _kont)

# Platzhalter, die kein Land bedeuten
_PLATZHALTER = {
    "", "remote", "various", "various locations", "multiple", "multiple locations",
    "worldwide", "global", "international", "anywhere", "flexible", "tbd", "n a",
    "nationwide", "online", "home based", "home-based", "verschiedene", "weltweit",
}


def _norm(text: str) -> str:
    """Kleinschreibung, Trennzeichen -> Leerzeichen, Mehrfach-Leerzeichen verdichten."""
    text = (text or "").strip().lower()
    text = text.replace("&", " and ")
    text = re.sub(r"[._/\-]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def _land_aus_token(token: str) -> tuple[str, str] | None:
    """Versucht, ein einzelnes Token einem Land/Kontinent zuzuordnen."""
    n = _norm(token)
    if not n:
        return None
    if n in _US_STATES or n in _US_STATE_NAMES:
        return ("USA", "Nordamerika")
    if n in _CA_PROVINZEN:
        return ("Kanada", "Nordamerika")
    if n in _AU_STAATEN:
        return ("Australien", "Ozeanien")
    if n in _UK_TEILE:
        return ("Vereinigtes Königreich", "Europa")
    if n in _LAND_INDEX:
        return _LAND_INDEX[n]
    return None


def aufloesen(ortstext: str | None) -> tuple[str, str | None, str]:
    """Wandelt einen Ortstext in ``(land, region, kontinent)``.

    ``land``/``kontinent`` sind leer, wenn nichts Sicheres erkannt wurde; ``region`` ist
    die mutmaßliche Stadt/Region (der Teil vor dem erkannten Land), sonst ``None``.
    """
    if not ortstext:
        return ("", None, "")
    if _norm(ortstext) in _PLATZHALTER:
        return ("", None, "")

    teile = [t.strip() for t in re.split(r"[,/|]", ortstext) if t.strip()]
    if not teile:
        teile = [ortstext.strip()]

    # 1) Tokens von hinten nach vorne prüfen (Land/Bundesstaat steht meist hinten)
    for i in range(len(teile) - 1, -1, -1):
        part = teile[i]
        treffer = _land_aus_token(part)
        if treffer:
            land, kont = treffer
            region = teile[i - 1] if i >= 1 else None
            return (land, region, kont)
        # Format „City ST" / „City PROV": letztes 2-Buchstaben-Wort als Code prüfen
        worte = part.split()
        if len(worte) >= 2 and len(worte[-1]) == 2:
            treffer = _land_aus_token(worte[-1])
            if treffer:
                land, kont = treffer
                return (land, " ".join(worte[:-1]), kont)

    # 2) Gesamtstring als Land prüfen (mehrteilige Namen ohne Komma, z. B. "South Africa")
    treffer = _land_aus_token(ortstext)
    if treffer:
        land, kont = treffer
        return (land, None, kont)

    # 3) Nichts erkannt
    return ("", teile[0] if teile else None, "")
