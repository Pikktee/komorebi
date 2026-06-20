"""Pipeline-Einstiegspunkt: sammeln -> Eignung prüfen -> normalisieren -> dedup -> JSON.

Aufruf:
  python3 build.py                 # nur Seed-Daten (keine Netzwerkzugriffe, immer lauffähig)
  python3 build.py --live          # zusätzlich Live-Scraper (benötigt httpx/selectolax)
  python3 build.py --live --llm    # zusätzlich LLM-Eignungsfilter (benötigt OPENROUTER_API_KEY)

Eignungs-Pipeline für Live-Stellen (Seed gilt als kuratiert und passiert ungefiltert):
  1. deterministisch (eignung.py): klar passende übernehmen, klare Festanstellungen verwerfen.
  2. optional LLM (llm.py): entscheidet die unklaren Fälle und prüft die übrigen gegen,
     ergänzt Tätigkeitsfelder. Ohne Key/Netz werden unklare Stellen konservativ behalten.

Schreibt ``data/datensatz.json`` und – falls vorhanden – ``web/public/datensatz.json``.
Bestehende ``erstmals_gesehen``-Werte werden anhand der stabilen ``id`` erhalten.
"""
from __future__ import annotations

import json
import os
import sys
from datetime import date
from pathlib import Path

HIER = Path(__file__).resolve().parent
sys.path.insert(0, str(HIER))

import dedup  # noqa: E402
import eignung  # noqa: E402
import llm  # noqa: E402
from normalize import normalize_record  # noqa: E402
from sources import seed  # noqa: E402

PROJEKT = HIER.parent
AUSGABEN = [
    HIER / "data" / "datensatz.json",
    PROJEKT / "web" / "public" / "datensatz.json",
]

# Schutzschwelle: Ein Live-Lauf, der unter diesen Anteil des zuletzt geschriebenen
# Standes fällt, bricht ab statt zu überschreiben – fängt weggebrochene Quellen ab
# (z. B. ESC, das im CI an Rate-Limiting scheitert). Mit --ohne-schwelle abschaltbar.
MINDEST_ANTEIL = 0.7

GENERISCHE_QUELL_URLS = {
    "https://programmes.eurodesk.eu/volunteering",
    "https://www.volunteer.sci.ngo",
    "https://www.conservationjobboard.com",
    "https://www.conservation-careers.com/conservation-jobs",
    "https://www.weltwaerts.de",
    "https://oeko-freiwillig.de/freiwilligendienst-im-ausland",
    "https://www.nabu.de",
    "https://careers.conbio.org",
    "https://www.goeco.org",
    "https://www.volunteerhq.org",
}


def _lade_env() -> None:
    """Lädt ``.env`` (Projektwurzel oder pipeline/) ohne externe Abhängigkeit.

    Bereits gesetzte Umgebungsvariablen werden NICHT überschrieben – eine inline
    angegebene Variable (``OPENROUTER_API_KEY=… python build.py``) gewinnt also immer.
    """
    for pfad in (PROJEKT / ".env", HIER / ".env"):
        if not pfad.exists():
            continue
        for zeile in pfad.read_text(encoding="utf-8").splitlines():
            zeile = zeile.strip()
            if not zeile or zeile.startswith("#") or "=" not in zeile:
                continue
            schluessel, _, wert = zeile.partition("=")
            schluessel = schluessel.strip()
            wert = wert.strip().strip('"').strip("'")
            if schluessel and schluessel not in os.environ:
                os.environ[schluessel] = wert


def sammle_live() -> list[dict]:
    from sources import conservation_job_board, esc, goodwork, tamu_jobs

    records: list[dict] = []
    for modul in (conservation_job_board, tamu_jobs, goodwork, esc):
        try:
            gefunden = modul.fetch()
        except Exception as exc:  # noqa: BLE001 - eine Quelle darf den Build nicht kippen
            print(f"  [skip] {modul.QUELLE}: {exc}")
            continue
        print(f"  {modul.QUELLE}: {len(gefunden)} Roh-Treffer")
        records.extend(gefunden)
    return records


def ist_generische_quell_url(raw: dict) -> bool:
    """True für Seed-/Fallback-URLs, die nur auf Start- oder Suchseiten zeigen."""
    url = (raw.get("quell_url") or "").strip().rstrip("/")
    return url in GENERISCHE_QUELL_URLS


def pruefe_eignung(live: list[dict], nutze_llm: bool) -> tuple[list[dict], dict]:
    """Wendet die zweistufige Eignungsprüfung auf Live-Stellen an.

    Gibt die behaltenen Stellen und eine Statistik zurück.
    """
    geeignet: list[dict] = []
    kandidaten: list[dict] = []  # deterministisch geeignet ODER unklar -> ggf. an LLM
    verworfen_det = 0
    for r in live:
        status, _grund = eignung.bewerten(r)
        if status == "ungeeignet":
            verworfen_det += 1
        else:  # "geeignet" oder "unklar"
            kandidaten.append(r)

    verworfen_llm = 0
    if nutze_llm and llm.verfuegbar() and kandidaten:
        print(f"  LLM prüft {len(kandidaten)} Kandidaten …")
        urteile = llm.klassifiziere(kandidaten)
        for r, u in zip(kandidaten, urteile):
            if u is None or u.get("geeignet"):
                if u and u.get("taetigkeitsfeld"):
                    r["taetigkeitsfeld"] = u["taetigkeitsfeld"]
                geeignet.append(r)
            else:
                verworfen_llm += 1
    else:
        if nutze_llm and not llm.verfuegbar():
            print("  [llm] kein gültiger OPENROUTER_API_KEY – überspringe LLM-Stufe")
        geeignet = kandidaten

    stat = {
        "live_roh": len(live),
        "verworfen_deterministisch": verworfen_det,
        "verworfen_llm": verworfen_llm,
        "live_behalten": len(geeignet),
    }
    return geeignet, stat


def _bestehende_erstsichtung() -> dict[str, str]:
    pfad = AUSGABEN[0]
    if not pfad.exists():
        return {}
    try:
        daten = json.loads(pfad.read_text(encoding="utf-8"))
        stellen = daten.get("stellen", daten) if isinstance(daten, dict) else daten
        return {s["id"]: s["erstmals_gesehen"] for s in stellen if s.get("erstmals_gesehen")}
    except Exception:
        return {}


def _bestehende_anzahl() -> int:
    """Anzahl Stellen im zuletzt geschriebenen Datensatz (0 = keiner vorhanden)."""
    pfad = AUSGABEN[0]
    if not pfad.exists():
        return 0
    try:
        daten = json.loads(pfad.read_text(encoding="utf-8"))
        stellen = daten.get("stellen", daten) if isinstance(daten, dict) else daten
        return len(stellen)
    except Exception:
        return 0


def unterschreitet_schwelle(neu: int, vorher: int, anteil: float = MINDEST_ANTEIL) -> bool:
    """True, wenn ``neu`` unter ``anteil`` des vorherigen Standes liegt.

    Bei fehlendem Vorstand (``vorher == 0``, z. B. Erstlauf) niemals True – dann gibt
    es keinen guten Stand zu schützen.
    """
    return vorher > 0 and neu < int(vorher * anteil)


def entscheide_llm(strict: bool, auto: bool, key_ok: bool) -> str:
    """Status der LLM-Stufe: ``'an'`` | ``'aus'`` | ``'fehler'`` | ``'auto-ohne-key'``.

    - ``--llm`` (strict): verlangt ausdrücklich den LLM -> ohne gültigen Key 'fehler'.
    - ``--llm-auto``: best effort -> mit Key 'an', ohne Key 'auto-ohne-key' (kein Fehler).
    """
    if strict and not key_ok:
        return "fehler"
    if (strict or auto) and key_ok:
        return "an"
    if auto and not key_ok:
        return "auto-ohne-key"
    return "aus"


def main() -> int:
    _lade_env()
    live_an = "--live" in sys.argv
    heute = date.today().isoformat()

    status = entscheide_llm("--llm" in sys.argv, "--llm-auto" in sys.argv, llm.verfuegbar())
    if status == "fehler":
        # Fail-Fast: Wer ausdrücklich --llm verlangt, bekommt bei fehlendem/ungültigem Key
        # sofort einen klaren Fehler – kein stilles Weiterlaufen ohne LLM.
        print(
            "Fehler: --llm gesetzt, aber kein gültiger OPENROUTER_API_KEY gefunden.\n"
            "  Lösung: Key bereitstellen (einer der Wege) – oder --llm-auto/--llm weglassen:\n"
            "    • inline:  OPENROUTER_API_KEY=sk-or-... python3 build.py --live --llm\n"
            "    • export:  export OPENROUTER_API_KEY=sk-or-...\n"
            "    • .env:    OPENROUTER_API_KEY=sk-or-...  (in pipeline/.env oder Projektroot)\n"
            "  Hinweis: 'sk-or-…' mit drei Punkten ist nur ein Platzhalter, kein echter Key.",
            file=sys.stderr,
        )
        return 2
    if status == "auto-ohne-key":
        print("  [llm] kein gültiger OPENROUTER_API_KEY – nur deterministische Filterung "
              "(das ist ok; --llm-auto erzwingt keinen LLM).")
    nutze_llm = status == "an"

    roh = seed.get_records()
    print(f"Seed: {len(roh)} Stellen (kuratiert)")

    stat = {"live_roh": 0, "verworfen_deterministisch": 0, "verworfen_llm": 0, "live_behalten": 0}
    if live_an:
        live = sammle_live()
        if live:
            vorher_seed = len(roh)
            roh = [r for r in roh if not ist_generische_quell_url(r)]
            entfernt = vorher_seed - len(roh)
            if entfernt:
                print(f"Seed: {entfernt} Einträge mit generischer Quell-URL im Live-Lauf ausgeblendet")
        behalten, stat = pruefe_eignung(live, nutze_llm=nutze_llm)
        print(
            f"Eignung: {stat['live_roh']} roh -> "
            f"{stat['verworfen_deterministisch']} deterministisch verworfen, "
            f"{stat['verworfen_llm']} per LLM verworfen, "
            f"{stat['live_behalten']} behalten"
        )
        roh.extend(behalten)

    vorher = _bestehende_erstsichtung()
    normalisiert = []
    for r in roh:
        rec = normalize_record(r, heute=heute)
        if rec["id"] in vorher:
            rec["erstmals_gesehen"] = min(vorher[rec["id"]], rec["erstmals_gesehen"])
        normalisiert.append(rec)

    stellen = dedup.merge(normalisiert)
    stellen.sort(key=lambda s: (s["kostenpflichtig"], s["land"] or "zzz", s["titel"]))

    # Metriken berechnen
    quellen_stats = {}
    for s in stellen:
        q = s["quelle"] or "unbekannt"
        quellen_stats[q] = quellen_stats.get(q, 0) + 1

    # Schutzschwelle (nur im Live-Lauf): Bricht ab, statt einen guten Datenstand mit
    # einem degradierten zu überschreiben, wenn eine Quelle weggebrochen ist.
    if live_an and "--ohne-schwelle" not in sys.argv:
        vorher_anzahl = _bestehende_anzahl()
        if unterschreitet_schwelle(len(stellen), vorher_anzahl):
            print(
                f"Abbruch: nur {len(stellen)} Stellen – unter {MINDEST_ANTEIL:.0%} des "
                f"letzten Standes ({vorher_anzahl}). Wahrscheinlich ist eine Quelle "
                f"weggebrochen (z. B. ESC an Rate-Limiting). Datenstand NICHT überschrieben.\n"
                f"  Quellen diesmal: {quellen_stats}\n"
                f"  Falls der Rückgang echt ist: erneut mit --ohne-schwelle ausführen.",
                file=sys.stderr,
            )
            return 3

    fehlende_laender = sum(1 for s in stellen if not s.get("land"))
    gemappte_koordinaten = sum(1 for s in stellen if s.get("geo_lat") is not None and s.get("geo_lon") is not None)

    metriken = {
        "datenstand": heute,
        "gesamt": len(stellen),
        "quellen": quellen_stats,
        "fehlende_laender": fehlende_laender,
        "gemappte_koordinaten": gemappte_koordinaten,
        "llm_verwerfungen": stat.get("verworfen_llm", 0),
        "deterministisch_verworfen": stat.get("verworfen_deterministisch", 0),
    }

    ausgabe = {
        "generiert_am": heute,
        "anzahl": len(stellen),
        "metriken": metriken,
        "stellen": stellen
    }
    text = json.dumps(ausgabe, ensure_ascii=False, indent=2) + "\n"

    for pfad in AUSGABEN:
        if pfad.parent.exists() or pfad == AUSGABEN[0]:
            pfad.parent.mkdir(parents=True, exist_ok=True)
            pfad.write_text(text, encoding="utf-8")
            print(f"geschrieben: {pfad}  ({len(stellen)} Stellen)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
