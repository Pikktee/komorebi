# 🍃 Komorebi

**Wo das Licht durch die Blätter fällt – ökologische Freiwilligendienste weltweit.**
*Komorebi* (jap. 木漏れ日) ist das Sonnenlicht, das durch Blätter fällt. Die App sammelt
Naturschutz-, Artenschutz- und Feldforschungs-Stellen aus vielen Quellen und macht sie an
einem Ort durchsuchbar: nach Land, Dauer, Tätigkeitsfeld, Förderung und freier Kost & Unterkunft.

Nicht-kommerzielles Projekt. Daten werden täglich automatisch aktualisiert. Feste
Karrierejobs und kostenpflichtige Voluntourism-Angebote werden für dich herausgefiltert.

> Konzept & Machbarkeit: siehe [KONZEPT.md](KONZEPT.md) · Datenmodell: [datenmodell.md](datenmodell.md)

---

## Projektstruktur

```
föj/
├── pipeline/                    # Python: sammeln → Eignung prüfen → normalisieren → dedup → JSON
│   ├── sources/
│   │   ├── seed.py              # kuratierter Grundbestand (App ist nie leer)
│   │   ├── conservation_job_board.py  # Live-Scraper: Conservation Job Board (10 Kategorien)
│   │   ├── tamu_jobs.py         # Live-Scraper: Texas A&M Natural Resources Job Board
│   │   ├── geo.py               # Ortsdatenbank/Gazetteer: Ortstext → Land + Kontinent
│   │   └── http.py              # höfliches HTTP (robots.txt, Rate-Limit)
│   ├── eignung.py               # Stufe 1: deterministischer Eignungsfilter
│   ├── llm.py                   # Stufe 2: optionaler LLM-Filter über OpenRouter
│   ├── normalize.py · dedup.py · build.py
│   └── tests/                   # pytest
├── web/                         # React + Vite + Mantine Web-App
│   ├── src/{lib,components,pages}
│   └── public/datensatz.json    # vom Build erzeugt, von der App geladen
├── .github/workflows/           # täglicher Daten-Cron + Pages-Deploy
└── KONZEPT.md · datenmodell.md · .env.example
```

## Wie die Daten ins System kommen

1. **Sammeln** – ein kuratierter **Seed** (immer vorhanden) plus echte **Live-Scraper**
   (*Conservation Job Board* und *Texas A&M Natural Resources Job Board* – beide
   server-gerendert und robots.txt-konform). Weitere geprüfte, aber nicht automatisch
   einlesbare Quellen (z. B. Conservation Careers, GoodWork.ca, EnvironmentJob, SCA,
   AmeriCorps, Eurodesk) sind als **Deep-Links** unter „Weitere Plattformen" erreichbar.
2. **Eignung prüfen (zweistufig)** – damit nur passende, FÖJ-ähnliche Stellen erscheinen:
   - **Stufe 1 – deterministisch** (`eignung.py`): verwirft klar feste Karrierestellen
     (`permanent`, `faculty-postdoc`, Manager:in/Direktor:in …) und übernimmt klar
     passende (Praktikum, Saison, Volunteer, Feldassistenz …). Spart LLM-Aufrufe.
   - **Stufe 2 – LLM, optional** (`llm.py`): ein günstiges Modell über **OpenRouter**
     entscheidet die unklaren Fälle, prüft die übrigen gegen und ergänzt Tätigkeitsfelder.
     Es entfernt das *subtile* Rauschen, das Stichwort-Regeln nicht erkennen – z. B.
     getarnte **Studiengänge/Online-Kurse**, fachfremde **IT-/Marketing-/Economics-Jobs**
     und versteckte **Fest-/Senior-Stellen** (in Tests ~25–30 % zusätzliche Treffer).
     **Ohne API-Key bleibt die Pipeline voll funktionsfähig** (rein deterministisch).
3. **Ort auflösen** (`geo.py`) – Ortstexte wie „Dixon, CA", „south-carolina" oder
   „Costa Rica" werden per Gazetteer + Heuristik auf saubere Länder + Kontinent abgebildet.
4. **Normalisieren & Deduplizieren** – Abbildung aufs Zielschema, Zusammenführen gleicher
   Stellen aus mehreren Quellen.
5. **Ausgeben** – ein `datensatz.json`, das die statische Web-App lädt und client-seitig filtert.

### Quellen-Vetting-Regel

Automatisch eingelesen wird eine Quelle **nur**, wenn (a) ihre `robots.txt` die Listing-
Seiten erlaubt, (b) ihre AGB automatisierten Zugriff nicht verbieten und (c) keine aktive
Bot-Sperre vorliegt. Quellen, die durchfallen (z. B. Worldpackers, Workaway), werden
**nicht** gescrapt, sondern im Bereich **„Weitere Plattformen"** nur **verlinkt**.

## Schnellstart (einfach – via `make`)

Im Projektordner genügen diese Befehle:

```bash
make setup     # einmalig: Python- & Node-Abhängigkeiten installieren
make daten     # Stellen neu einsammeln & filtern – IMMER mit LLM (Key nötig)
make web       # Web-App starten  ->  http://localhost:5173
make start     # beides: erst Daten befüllen, dann Web-App starten
make           # zeigt alle Befehle
```

**Befüllen läuft immer mit LLM.** `make daten` zieht den OpenRouter-Key automatisch (aus `.env`,
Shell oder inline). Fehlt ein gültiger Key, **bricht der Lauf bewusst mit Fehler ab** – so
gelangen keine irrelevanten Stellen (getarnte Studiengänge, fachfremde Jobs …) ins System.
Geschrieben werden `pipeline/data/datensatz.json` **und** `web/public/datensatz.json`.
(Nur zum schnellen Testen ohne Netz/LLM: `make daten-schnell` – reine Seed-Daten.)

### Manuell (ohne `make`)

```bash
# Daten (Python ≥ 3.9)
cd pipeline
python3 build.py                 # nur Seed (keine Netzwerkzugriffe – immer lauffähig)
python3 build.py --live          # + Live-Scraper, deterministischer Filter
python3 build.py --live --llm-auto   # + LLM, falls Key vorhanden (sonst ohne, ohne Fehler)
python3 build.py --live --llm        # LLM erzwingen: bricht mit Fehler ab, wenn kein Key da ist

# Web-App (Node ≥ 20)
cd web && npm install && npm run dev
```

## Tests

```bash
cd pipeline && python3 -m pytest -q     # Pipeline (Geo, Eignung, Scraper, LLM-Offline …)
cd web && npm test                      # Filterlogik, URL-State, Komponenten
```

## API-Key & Sicherheit

Die LLM-Stufe nutzt **OpenRouter**. Der Schlüssel wird **ausschließlich aus der Umgebung**
gelesen (`OPENROUTER_API_KEY`) – er steht nirgends im Code und gehört **nicht** ins Repo.

- Lokal, drei gleichwertige Wege (der erste Treffer gewinnt: Inline > Shell-Export > `.env`):
  1. **Inline** (nur dieser Lauf): `OPENROUTER_API_KEY=sk-or-... python3 build.py --live --llm`
  2. **Shell-Export** (ganze Sitzung): `export OPENROUTER_API_KEY=sk-or-...`
  3. **`.env`-Datei** (dauerhaft, wird automatisch geladen): lege `pipeline/.env` oder eine
     `.env` im Projektroot an mit `OPENROUTER_API_KEY=sk-or-...`. Sie ist per `.gitignore`
     ausgeschlossen; Vorlage siehe [.env.example](.env.example). **Eine `.env` ist optional** –
     der Inline-Weg reicht völlig.
  > Wichtig: `sk-or-…` (mit „…") ist nur ein Platzhalter. Mit ihm überspringt die Pipeline die
  > LLM-Stufe **ohne Fehler** (`… kein gültiger OPENROUTER_API_KEY …`). Nutze den echten Key.
- In GitHub Actions: als **Repository-Secret** `OPENROUTER_API_KEY` hinterlegen.
- Standardmodell: `google/gemini-2.5-flash-lite` (sehr günstig); via `OPENROUTER_MODEL`
  änderbar. Ein voller Lauf kostet nur wenige Zehntelcent.

> ⚠️ Falls ein Key je im Klartext geteilt wurde (Chat, Commit, Screenshot), im OpenRouter-
> Dashboard **widerrufen und neu erzeugen**.

## Features der Web-App

- **Filter** nach Suche, Land, Tätigkeitsfeld, Kontinent, Förderung, Dauer sowie
  „nur freie Kost & Unterkunft" und „kostenpflichtige ausblenden" (Default).
- **Deep-Links:** Die Filterauswahl steht in der URL – teilbar und direkt aufrufbar.
  Eigene Routen für Start, Suche, Detailseite und Plattformverzeichnis (Browser-Historie).
- **Responsiv** für Desktop, Tablet und Handy (Filter auf dem Handy im Drawer).
- **Tooltips** erklären Förderprogramme, Leistungen und die Voluntourism-Falle.
- Durchgehend **du-Ansprache**, deutsche Texte mit korrekten Umlauten.

## Deployment

`deploy.yml` baut die App und veröffentlicht sie auf **GitHub Pages** (inkl. `404.html` als
SPA-Fallback). `update-data.yml` aktualisiert den Datenstand täglich um 04:00 UTC; liegt das
Secret `OPENROUTER_API_KEY` vor, läuft dabei auch die LLM-Eignungsstufe.

## Bewusste Grenze

Plattformen, die automatisierten Zugriff per AGB untersagen oder technisch blockieren
(z. B. Worldpackers), werden **nicht** gescrapt – auch nicht über Umwege. Sie sind über das
Deep-Link-Verzeichnis erreichbar.
