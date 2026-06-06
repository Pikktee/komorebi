"""Eignungsprüfung Stufe 2 (LLM, optional): ein günstiges Modell über OpenRouter klassifiziert
die in Stufe 1 unklaren Stellen und ergänzt Tätigkeitsfelder.

Bewusst defensiv:
- Läuft **nur**, wenn ein API-Key vorliegt (Parameter oder ``OPENROUTER_API_KEY``) und
  ``--llm`` gesetzt ist. Ohne Key/Netz bleibt die Pipeline voll funktionsfähig
  (Stufe 1 entscheidet allein, unklare Stellen werden konservativ behalten).
- Bei jedem Fehler (Netz, Quota, kaputtes JSON) liefert eine Anfrage ``None`` zurück;
  der Build bricht nie ab.
- Der System-Prompt ist konstant (Prompt-Caching-freundlich); die Stellen kommen
  gebündelt als JSON, die Antwort kommt als striktes JSON zurück.

Der Key wird **niemals** im Code/Repo gespeichert, sondern aus der Umgebung gelesen.
"""
from __future__ import annotations

import json
import os
import re
from typing import Optional

from sources.base import TAETIGKEITSFELDER

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
STANDARD_MODELL = "google/gemini-2.5-flash-lite"
_BATCH = 20

_SYSTEM = (
    "Du hilfst, eine Sammlung ökologischer Freiwilligen- und Praktikumsstellen für eine "
    "angehende Biologin/Umweltforscherin zu kuratieren. Sie sucht FÖJ-ähnliche Stellen: "
    "Naturschutz, Artenschutz, Meeresschutz, Feldforschung/Feldassistenz, Umweltbildung, "
    "ökologische Landwirtschaft – befristet, oft mit Unterkunft/Taschengeld, für junge "
    "Menschen ohne lange Berufserfahrung.\n"
    "GEEIGNET sind: Volunteer-, Praktikums-, Saison-, Feldassistenz-, Fellowship-, "
    "Trainee- und Forschungsassistenz-Stellen mit ökologischem/biologischem Bezug.\n"
    "UNGEEIGNET sind: feste Karrierestellen (Manager:in, Direktor:in, Professur, Senior-/"
    "Leitungsrollen), rein verwaltende/juristische/IT-/Fundraising-Stellen ohne Feldbezug "
    "und alles ohne Natur-/Umweltbezug.\n"
    "Ordne jeder Stelle 1–2 Tätigkeitsfelder aus dieser Liste zu: "
    + ", ".join(TAETIGKEITSFELDER) + ".\n"
    "Antworte AUSSCHLIESSLICH als JSON-Objekt der Form "
    '{\"ergebnisse\":[{\"nr\":<int>,\"geeignet\":<bool>,'
    '\"taetigkeitsfeld\":[<string>],\"grund\":<kurzer string>}]}. '
    "Kein Text davor oder danach."
)


def _key_gueltig(api_key: Optional[str]) -> bool:
    """True nur für einen echten, ASCII-kodierbaren OpenRouter-Key (kein Platzhalter)."""
    if not api_key:
        return False
    try:
        api_key.encode("ascii")  # HTTP-Header müssen ASCII sein
    except UnicodeEncodeError:
        return False
    if "…" in api_key or "..." in api_key:  # typischer Platzhalter „sk-or-…"
        return False
    return api_key.startswith("sk-or-") and len(api_key) > 24


def verfuegbar(api_key: Optional[str] = None) -> bool:
    return _key_gueltig(api_key or os.environ.get("OPENROUTER_API_KEY"))


def _post(payload: dict, api_key: str, timeout: float) -> Optional[dict]:
    import httpx  # lazy

    antwort = httpx.post(
        OPENROUTER_URL,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/komorebi",
            "X-Title": "Komorebi",
        },
        json=payload,
        timeout=timeout,
    )
    antwort.raise_for_status()
    return antwort.json()


def _json_aus_text(text: str) -> Optional[dict]:
    """Holt das erste JSON-Objekt aus einem Modell-Output (robust gegen Geschwätz)."""
    try:
        return json.loads(text)
    except Exception:
        pass
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None


def _batch_klassifizieren(
    teil: list[dict], api_key: str, modell: str, timeout: float
) -> list[Optional[dict]]:
    items = [
        {
            "nr": i,
            "titel": r.get("titel", ""),
            "organisation": r.get("organisation", ""),
            "ort": r.get("_location_text") or r.get("land") or "",
            "job_type": r.get("_job_type", ""),
            "kategorie": r.get("_kategorie", ""),
        }
        for i, r in enumerate(teil)
    ]
    payload = {
        "model": modell,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": _SYSTEM},
            {"role": "user", "content": "Bewerte diese Stellen:\n" + json.dumps(
                items, ensure_ascii=False)},
        ],
    }
    try:
        daten = _post(payload, api_key, timeout)
        inhalt = daten["choices"][0]["message"]["content"]
        geparst = _json_aus_text(inhalt)
        if not geparst:
            return [None] * len(teil)
    except Exception as exc:  # noqa: BLE001 - LLM darf ausfallen
        print(f"  [llm] Batch übersprungen: {exc}")
        return [None] * len(teil)

    ergebnis: list[Optional[dict]] = [None] * len(teil)
    for e in geparst.get("ergebnisse", []):
        try:
            nr = int(e["nr"])
        except (KeyError, TypeError, ValueError):
            continue
        if 0 <= nr < len(teil):
            felder = [f for f in e.get("taetigkeitsfeld", []) if f in TAETIGKEITSFELDER]
            ergebnis[nr] = {
                "geeignet": bool(e.get("geeignet")),
                "taetigkeitsfeld": felder,
                "grund": str(e.get("grund", ""))[:200],
            }
    return ergebnis


def klassifiziere(
    records: list[dict],
    api_key: Optional[str] = None,
    modell: Optional[str] = None,
    timeout: float = 60.0,
) -> list[Optional[dict]]:
    """Klassifiziert ``records`` gebündelt. Gibt eine zu ``records`` ausgerichtete Liste
    zurück (``None`` = keine Aussage möglich -> Aufrufer entscheidet konservativ)."""
    api_key = api_key or os.environ.get("OPENROUTER_API_KEY")
    modell = modell or os.environ.get("OPENROUTER_MODEL") or STANDARD_MODELL
    if not records:
        return []
    if not _key_gueltig(api_key):
        if api_key:
            print("  [llm] API-Key sieht nach Platzhalter aus / ist ungültig – "
                  "überspringe LLM (bitte den echten OpenRouter-Key setzen).")
        return [None] * len(records)

    ergebnis: list[Optional[dict]] = []
    for start in range(0, len(records), _BATCH):
        teil = records[start:start + _BATCH]
        ergebnis.extend(_batch_klassifizieren(teil, api_key, modell, timeout))
    return ergebnis
