# Konzept & Machbarkeit: Naturschutz-/Umwelt-Volunteering weltweit — Finder

*Stand: 2026-06-05 · nicht-kommerzielles Projekt*

---

## 1. Problem & Zielgruppe

Die Zielnutzerin (Tochter einer Freundin) will später **Biologie / Umweltforschung**
studieren und sucht **weltweit** Freiwilligenstellen in dieser Richtung: Naturschutz,
Ökologie, Arten- und Meeresschutz, Feld- und Forschungsassistenz. Vorbild ist das
deutsche **Freiwillige Ökologische Jahr (FÖJ)**, aber bewusst weiter gefasst:

- **nicht** zwingend EU-gefördert,
- im Optimalfall mit **freier Kost & Unterkunft**.

**Das Kernproblem ist nicht fehlende Information, sondern Fragmentierung.** Passende
Stellen liegen über dutzende Quellen verstreut (EU-Portal, deutsche Träger,
Naturschutz-Jobbörsen, internationale Workcamp-Netzwerke, kommerzielle Plattformen),
jeweils unterschiedlich strukturiert und **nicht gemeinsam filterbar** nach den Kriterien,
die wirklich zählen: Land/Region, Zeitraum, Dauer, Tätigkeitsfeld, Bewerbungsfrist,
Leistungen — und vor allem „**ist es kostenlos oder muss ich zahlen?**".

**Ziel:** ein Tool, das diese Stellen **automatisch täglich** einsammelt, vereinheitlicht
und in **einer filterbaren Oberfläche** durchsuchbar macht.

## 2. Scope & Begriffe

| Begriff | Was es ist |
|---|---|
| **FÖJ** | Freiwilliges Ökologisches Jahr — nur Deutschland. *Im Ausland* nur ~30–40 Plätze/Jahr → als alleinige Basis zu klein. |
| **ESC** | European Solidarity Corps / Europäisches Solidaritätskorps — die EU-weite Entsprechung, 18–30 J., 2 Wochen–12 Monate, EU-gefördert. |
| **IJFD** | Internationaler Jugendfreiwilligendienst — weltweit, staatlich gefördert. |
| **weltwärts** | entwicklungspolitischer Freiwilligendienst (v. a. Global South), gefördert. |

**Scope-Entscheidung:** Der enge FÖJ-Begriff wird als *Vorbild* genommen, der **Datenscope
aber breit** gefasst — alle geförderten Dienste in dieser Richtung **plus** ungeförderte
weltweite Naturschutz-/Forschungs-Volunteering-Stellen, idealerweise mit freier Kost &
Logis. Förderung ist optional, freie Kost & Unterkunft das bevorzugte Kriterium.

## 3. Wie funktioniert die EU-Förderung (ESC)?

Eine im Team offene Frage — hier die faktische Antwort. Die EU zahlt **keinen Lohn**,
sondern finanziert den Platz so, dass er **für die Freiwillige kostenlos** ist. Das Geld
geht überwiegend an die Aufnahme-/Entsendeorganisation und deckt:

- **Reisekosten** — Pauschale nach Entfernungsband, Bonus für „grünes" Reisen
- **Unterkunft + Verpflegung** — Tagespauschale an die Aufnahmeorganisation
- **Taschengeld** — direkt an die Freiwillige, **~2–6 €/Tag** je nach Land
- **Versicherung** — zentrale Henner-Gruppenversicherung
- **Sprachkurs / Vorbereitungstraining**, plus Inklusionszuschüsse bei Bedarf

Gefördert werden also **genau die Kosten, die sonst die Jugendliche trüge** — nicht billige
Arbeitskraft. Im Gegenzug hat die Aufnahmeorganisation Auflagen (Mentoring, Lernziele,
keine Verdrängung regulärer Stellen). Dieser „freie Kost & Logis + Taschengeld"-Standard
gilt analog für **IJFD** und **weltwärts** und ist die Referenz für unseren Filter.

Quellen: [Annex – Applicable Rates ESC](https://www.europeansolidaritycorps.nl/sites/default/files/files/3.%20Annex%203%20-%20Applicable%20rates%20ESC51.pdf),
[INEX FAQ ESC](https://www.inexsda.cz/en/faq-esc/),
[European Youth Portal – Volunteering](https://youth.europa.eu/solidarity/young-people/volunteering_en).

## 4. Quellenlandschaft & Machbarkeit

### Vetting-Regel (Gate für jede Quelle)

> **Automatischer Ingest nur, wenn (a) robots.txt die Listing-/Suchseiten erlaubt, (b) die
> AGB automatisierten Zugriff nicht verbieten und (c) keine aktive Bot-Sperre (z. B. 403)
> vorliegt. Andernfalls: nur Deep-Link.**

### Tier A — automatisch ingestierbar (Rückgrat)

| Quelle | Inhalt |
|---|---|
| [Eurodesk Opportunity Finder](https://programmes.eurodesk.eu/volunteering) | ESC/geförderte Volunteer-Opps, Filter Land/Thema (JS-gerendert → JSON-API/Playwright) |
| weltwärts / IJFD Trägerlisten | geförderte Ökoplätze weltweit |
| [Conservation Job Board](https://www.conservationjobboard.com/) · [Conservation Careers](https://www.conservation-careers.com/conservation-jobs/) | Naturschutz-/Ökologie-Stellen + Volunteer-Kategorie |
| [Society for Conservation Biology](https://careers.conbio.org/) | ~950 Stellen inkl. Volunteer/Internship |
| Texas A&M Wildlife & Fisheries Board · [ESA / ECOLOG-L](https://esa.org/career-development/job-sites/) | Feldassistenz, seasonal, REU |
| [SCI / NICE / Concordia / ICYE Workcamps](https://www.volunteer.sci.ngo/) | ökologische, oft **kostenfreie** Workcamps (v. a. Europa) |
| FÖF / NABU / BUND / AKLHÜ | deutsche Öko-Auslandsplätze |
| **Kandidaten (erst vetten):** HelpStay, Go Overseas, GoEco, IVHQ, IFRE, Worldwide Vets, Volunteer World, GoAbroad, Idealist | Wildlife-/Naturschutz weltweit, teils frei, teils kostenpflichtig |

**Meta-Verzeichnisse als Quellen-Saatgut:**
[James Borrell – Conservation Volunteering Database](http://www.jamesborrell.com/resources/conservation-volunteering-database/),
[WILDLABS – Where to look for conservation jobs](https://wildlabs.net/discussion/where-look-conservation-jobs-running-list).

### Tier B — NICHT ingestierbar, nur Deep-Link

- **[Worldpackers](https://www.worldpackers.com/)** — robots.txt erlaubt Listings, *aber*
  die [AGB](https://www.worldpackers.com/terms) verbieten „scrapers/automated means"
  ausdrücklich, erlauben nur „personal, non-commercial", untersagen Ersatz-/Konkurrenz-
  dienste; `/search` antwortet automatisiert mit **403 (Cloudflare)**. → nur Deep-Link.
- **Workaway, WWOOF, HelpX** — Login/Paywall + Anti-Scraping. → nur Deep-Link.

> **Bewusst ausgeschlossen:** das Umgehen der Worldpackers-Bot-Sperre per
> curl_cffi/Browser-Automation. Das aktive Aushebeln einer technischen Schutzmaßnahme
> gegen den erklärten Willen des Betreibers wird nicht umgesetzt — unabhängig vom privaten
> Zweck. Wird später ggf. extern ergänzt.

### Datenfalle: Voluntourism

Viele weltweite „Conservation-Volunteer"-Programme sind **kostenpflichtig** (die Freiwillige
*zahlt*). Ohne Gegenmaßnahme ersäuft die echte Zielmenge in Bezahlangeboten. → Pflichtfelder
`kostenpflichtig` und `kost_unterkunft_frei`, mit **Default-Filter „nur kostenlose Plätze"**.

### Erwarteter Datenbestand

Durch den weltweiten, breiten Scope realistisch **hunderte gleichzeitig offene Stellen** in
Tier A — überschaubar genug für client-seitige Filterung, groß genug, um nützlich zu sein.

## 5. Leitentscheidung

**Tägliche automatische Scraping-Pipeline für alle Tier-A-Quellen, die das Vetting-Gate
bestehen; Deep-Link-Verzeichnis für Tier B.** Kein laufender Server, keine Kosten, keine
manuelle Kuratierung der Stellen.

## 6. Architektur & Tech-Stack

```
[Scraper je Tier-A-Quelle] → [Normalisierung] → [Dedup/Merge]
   → [datensatz.json (+ SQLite Historie)] → [Static Frontend: Filter + Tier-B-Deeplinks]
                    ▲
   [Scheduler: GitHub Actions cron, 1×/Tag]
```

- **Scraper:** Python; ein Modul je Quelle mit gleicher Schnittstelle (`fetch() -> list[Stelle]`).
  `httpx` + `selectolax`/`BeautifulSoup`; **Playwright** nur für JS-Quellen (Eurodesk).
  Höflich: fester User-Agent, Rate-Limit, robots.txt-Respekt.
- **Normalisierung:** Mapping je Quelle auf das [Datenmodell](datenmodell.md), inkl.
  Tätigkeitsfeld- und Leistungs-Mapping.
- **Dedup/Merge:** gleiche Stelle quellenübergreifend zusammenführen (Organisation + Land +
  Titel, fuzzy); alle Quell-URLs am Eintrag sammeln.
- **Storage:** `datensatz.json` (Frontend-Quelle) + `datensatz.sqlite` (Historie/Diffs:
  neue/verschwundene Stellen). Täglich neu erzeugt.
- **Scheduler:** **GitHub Actions cron**, 1×/Tag → scrapen, regenerieren, committen/deployen.
- **Frontend:** schlanke SPA (Vite), client-seitige Filter (Land/Region, Zeitraum,
  Tätigkeitsfeld, „nur freie Kost & Logis", Förderung, kostenpflichtig); separater Bereich
  mit **Deep-Links** zu Tier-B-Plattformen. Statisch hostbar (GitHub Pages / Vercel).

## 7. Datenmodell

Vollständig in **[datenmodell.md](datenmodell.md)**; gültige Beispiel-Datensätze in
**[beispieldaten.json](beispieldaten.json)** (illustrativ, noch nicht live gescrapt).
Kernfelder: Identität, Ort/Zeit, Tätigkeitsfeld, Bewerbung, Förderung/Leistungen
(inkl. `kost_unterkunft_frei`, `kostenpflichtig`), Herkunft/Diff-Felder.

## 8. Risiken & Pflege

| Risiko | Gegenmaßnahme |
|---|---|
| Paywall/AGB (Worldpackers, Workaway, WWOOF, HelpX) | kein Ingest, nur Deep-Link — saubere Grenze, im UI kommuniziert |
| Voluntourism-Verzerrung | `kostenpflichtig`/`kost_unterkunft_frei` als Pflichtfelder, Default-Filter „frei" |
| JS-gerenderte/instabile Quellen | erst interne JSON-API, Playwright als Fallback; Schema-Check + Alarm bei 0 Treffern |
| Scraper-Bruch bei Layout-Änderung | modular je Quelle — Ausfall einer Quelle kippt den Rest nicht |
| Recht/ToS/robots.txt | vor Bau je Quelle prüfen; nur öffentliche Seiten; faire Rate-Limits |
| Datenqualität ohne Kuratierung | Normalisierung + Dedup; Quelle & „zuletzt geprüft"-Datum je Eintrag sichtbar |

## 9. Roadmap & nächste Schritte

1. **Quellen-Vetting** pro Tier-A-Kandidat (robots.txt + AGB + Bot-Sperre) → finale Ingest-Liste.
2. **Scraper-Gerüst** + erste 2–3 Quellen (Eurodesk, SCI-Workcamps, Conservation Job Board).
3. **Normalisierung + Dedup**, Erzeugung von `datensatz.json`/SQLite.
4. **GitHub-Actions-Cron** (täglich).
5. **Frontend** mit Filtern + Deep-Link-Verzeichnis.
6. Optionales **`/code-review ultra`** nach Code-Stand (Git-Repo dafür einrichten).

## 10. Quellenverzeichnis

- European Youth Portal / ESC — https://youth.europa.eu/solidarity
- Eurodesk Opportunity Finder — https://programmes.eurodesk.eu/volunteering
- ESC Applicable Rates (Annex) — https://www.europeansolidaritycorps.nl/sites/default/files/files/3.%20Annex%203%20-%20Applicable%20rates%20ESC51.pdf
- Conservation Job Board — https://www.conservationjobboard.com/
- Conservation Careers — https://www.conservation-careers.com/conservation-jobs/
- Society for Conservation Biology — https://careers.conbio.org/
- ESA Job Sites / ECOLOG-L — https://esa.org/career-development/job-sites/
- SCI Workcamps — https://www.volunteer.sci.ngo/
- James Borrell – Conservation Volunteering Database — http://www.jamesborrell.com/resources/conservation-volunteering-database/
- WILDLABS – Conservation jobs list — https://wildlabs.net/discussion/where-look-conservation-jobs-running-list
- wege-ins-ausland.de (FÖJ Ausland) — https://www.wege-ins-ausland.de
- rausvonzuhaus.de / Eurodesk DE — https://www.rausvonzuhaus.de/fsj-und-foej
- FÖF e.V. — https://oeko-freiwillig.de/freiwilligendienst-im-ausland/
- Deep-Link-Plattformen: Worldpackers, Workaway, WWOOF, HelpX, HelpStay, Volunteer World, Go Overseas, GoAbroad, Idealist, GVI, Biosphere Expeditions, Frontier, Coral Cay, Projects Abroad, GoEco, IVHQ, Worldwide Vets
