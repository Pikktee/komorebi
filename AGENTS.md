# AGENTS.md

> Kanonische Agent-Anleitung dieses Repos. **`CLAUDE.md` ist ein Symlink auf diese Datei** –
> Claude Code und jeder andere AGENTS.md-fähige Agent lesen denselben Inhalt, beide Dateien
> bleiben automatisch synchron. Bitte **AGENTS.md** bearbeiten, nicht den Symlink.

This file provides guidance to Claude Code (claude.ai/code) and other coding agents when working
with code in this repository.

## Was das ist

**Komorebi** – eine nicht-kommerzielle Web-App, die ökologische Freiwilligendienste/Praktika/
Feldforschungs-Stellen weltweit sammelt und filterbar macht (Zielnutzerin: angehende Biologin).
Python-Daten-Pipeline + statisches React-Frontend, täglich via GitHub Actions aktualisiert,
auf GitHub Pages gehostet. Sprache durchgehend **Deutsch, du-Ansprache, echte Umlaute** (ö/ü/ä,
niemals oe/ue/ae).

## Befehle

Am einfachsten über das `Makefile` (Projektroot):

```bash
make setup          # einmalig: pip install + npm install
make daten          # Daten neu befüllen – IMMER mit LLM (Key nötig, sonst Fehler)
make web            # Dev-Server: http://localhost:5173
make start          # daten + web
make daten-schnell  # nur Seed (kein Netz/LLM) – nur zum Testen
```

Manuell / Details:

```bash
# Pipeline (Python ≥ 3.9, in pipeline/)
python3 build.py                    # nur Seed-Daten, keine Netzwerkzugriffe
python3 build.py --live             # + Live-Scraper, nur deterministische Filterung
python3 build.py --live --llm-auto  # + LLM, falls Key vorhanden (sonst ohne, ohne Fehler)
python3 build.py --live --llm       # LLM erzwingen: Fail-Fast (Exit 2) ohne gültigen Key

# Tests
cd pipeline && python3 -m pytest -q
python3 -m pytest tests/test_geo.py::test_us_stadt_mit_kuerzel   # einzelner Test
cd web && npm test                                              # vitest (alle)
npx vitest run src/lib/filter.test.ts                           # einzelne Datei

# Frontend-Build (Typecheck + Bundle) – immer nach Frontend-Änderungen laufen lassen
cd web && npm run build
```

## Architektur

### Daten-Pipeline (`pipeline/`) — der Kern ist ein zweistufiger Eignungsfilter

`build.py:main()` orchestriert: **sammeln → Eignung prüfen → Ort auflösen → normalisieren →
deduplizieren → JSON schreiben**. Es schreibt **zwei** Dateien: `pipeline/data/datensatz.json`
und `web/public/datensatz.json` (die das Frontend lädt). Beide sind **eingecheckt** (versioniertes
Output; der Cron regeneriert sie). `erstmals_gesehen` bleibt über Läufe via stabiler `id` erhalten.

- **Quellen** (`sources/*.py`): Jede liefert `fetch() -> list[dict]` und ein `QUELLE`-Label.
  - `seed.py` = kuratierter Grundbestand (App ist nie leer; gilt als „geeignet").
  - `conservation_job_board.py`, `tamu_jobs.py` = echte Live-Scraper (server-gerendert).
  - Scraper setzen **`_`-präfixierte Helfer-Felder** (`_job_type`, `_experience`,
    `_location_text`, `_kategorie`) für die Filterstufen. `normalize_record` übernimmt **nur**
    `SCHEMA_FELDER` → die Helfer-Felder fallen automatisch raus (dürfen nie im Output landen).
- **Stufe 1 – `eignung.py` (deterministisch):** `bewerten(raw) -> ("geeignet"|"ungeeignet"|
  "unklar", grund)`. Harte Negativ-Titel (Manager/Director/…) und `_job_type`/Erfahrung
  überschreiben auch positive Signale. Seed ist immer „geeignet".
- **Stufe 2 – `llm.py` (OpenRouter, optional):** `build.pruefe_eignung` schickt die Kandidaten
  (deterministisch *geeignet* **oder** *unklar*) an das LLM; es verwirft das *subtile* Rauschen
  (getarnte Studiengänge, fachfremde Jobs, versteckte Festanstellungen) und ergänzt
  Tätigkeitsfelder. Ohne Key werden Kandidaten konservativ behalten. Default-Modell
  `google/gemini-2.5-flash-lite`; Key via `OPENROUTER_API_KEY`.
- **`sources/geo.py`** – Gazetteer + Heuristik: `aufloesen(ortstext) -> (land, region,
  kontinent)`. Kennt US-Staaten/CA-Provinzen/UK/AU + ~120 Länder (dt./engl.) und das Format
  „City ST/PROV". Wird **in den Scrapern** aufgerufen, bevor normalisiert wird.
- `normalize.py` (Rohdaten → `datenmodell.md`-Schema, leitet `kost_unterkunft_frei`/
  `kostenpflichtig` ab), `dedup.py` (Merge gleicher Stellen über Quellen hinweg),
  `sources/base.py` (Vokabular, `slug()`, `stabile_id()`, `feld_aus_text()`),
  `sources/http.py` (höfliches HTTP: robots.txt-Check + Rate-Limit; lazy `httpx`-Import).

### Frontend (`web/`) — statische SPA, client-seitige Filter

- Lädt `public/datensatz.json` über `lib/useStellen.ts`; **keine Server-Komponente**.
- **Filter-State steht in der URL** (`lib/filter.ts`: `parseFilter`/`filterToParams`) → Filter
  sind teil- und deep-linkbar. Routen in `App.tsx` (`/`, `/finden`, `/stelle/:id`, `/wissen`,
  `/plattformen`, `/ueber`, `*`).
- Mantine v9 + `theme.ts` (Farben `wald`/`terra`/`himmel`/`sonne`; Fonts Fraunces + Hanken).
  Marke/Logo in `components/Logo.tsx` (`KomorebiMark`). Tätigkeitsfeld-Farben in
  `components/TaetigkeitsPills.tsx` (`feldFarbe`).
- `lib/plattformen.ts` = Deep-Link-Verzeichnis der **nicht** automatisch eingelesenen Quellen.

## Harte Regeln & Stolperfallen
- **Befüllen nutzt immer den LLM:** `make daten` und der CI-Cron verwenden striktes `--llm` und
  brechen ohne gültigen Key bewusst ab. Convenience-/CI-Pfade dürfen nicht still auf
  deterministisch zurückfallen.
- **API-Key** nur aus der Umgebung: `OPENROUTER_API_KEY` (inline > Shell-`export` > `.env`).
  `build._lade_env()` lädt `pipeline/.env` oder `.env` im Root automatisch; `.env` ist
  gitignored und gehört nie ins Repo. `'sk-or-…'` mit „…" ist ein Platzhalter und wird abgelehnt.
- **Mantine v9:** `Group.gap` akzeptiert **kein** responsives Objekt (nur Zahl/Token);
  `<Grid>` meiden (TS-Fallen mit fraktionalen Spans) → stattdessen `Flex`/`SimpleGrid`.
- Neue Quelle hinzufügen = Modul mit `QUELLE` + `fetch()` in `sources/`, Geo dort auflösen,
  Helfer-Felder für die Eignung setzen, in `build.sammle_live()` registrieren, Parser-Test mit
  HTML-Fixture (siehe `tests/test_conservation_job_board.py`).

Konzept/Datenmodell: `KONZEPT.md`, `datenmodell.md`. Ausführliche Doku: `README.md`.
