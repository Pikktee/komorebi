# Datenmodell — normalisiertes Zielschema

Jeder Scraper liefert seine Treffer in **dieses** Schema (ein JSON-Objekt pro Stelle).
Die Normalisierung pro Quelle hat die Aufgabe, deren Rohdaten hierauf abzubilden.
`beispieldaten.json` enthält gültige Beispiel-Datensätze nach genau diesem Schema.

## Felder

| Feld | Typ | Pflicht | Bedeutung |
|---|---|---|---|
| `id` | string | ja | stabile, eindeutige ID (z. B. Hash aus `quelle` + `quell_id`/`quell_url`) |
| `titel` | string | ja | Titel der Stelle/des Projekts |
| `organisation` | string | ja | Anbieter/Träger (anzeigender Name) |
| `aufnahmeorganisation` | string\|null | nein | Organisation vor Ort |
| `entsendeorganisation` | string\|null | nein | entsendende Organisation (bei DE-geförderten Diensten) |
| `land` | string | ja | Zielland (ausgeschrieben, deutsch) |
| `region` | string\|null | nein | Region/Stadt |
| `kontinent` | string | ja | Europa, Afrika, Asien, Nordamerika, Südamerika, Ozeanien, Antarktis |
| `dauer_monate_min` | number\|null | nein | Mindestdauer in Monaten |
| `dauer_monate_max` | number\|null | nein | Maximaldauer in Monaten |
| `zeitraum_von` | string(YYYY-MM-DD)\|null | nein | frühester Start |
| `zeitraum_bis` | string(YYYY-MM-DD)\|null | nein | spätestes Ende |
| `flexibler_start` | bool | ja | Start jederzeit/flexibel? |
| `taetigkeitsfeld` | string[] | ja | Kategorien, kontrolliertes Vokabular (s. u.) |
| `beschreibung` | string | ja | Kurzbeschreibung der Tätigkeit |
| `bewerbungsfrist` | string(YYYY-MM-DD)\|null | nein | Bewerbungsschluss |
| `voraussetzungen` | object | ja | s. Unterfelder |
| `voraussetzungen.mindestalter` | number\|null | nein | Mindestalter |
| `voraussetzungen.hoechstalter` | number\|null | nein | Höchstalter |
| `voraussetzungen.sprache` | string\|null | nein | benötigte Sprache(n)/Niveau |
| `voraussetzungen.vorkenntnisse` | string\|null | nein | z. B. Tauchschein, Studienrichtung |
| `programm` | string | ja | Förderprogramm: `ESC`, `IJFD`, `weltwärts`, `kulturweit`, `keins` |
| `kost_unterkunft_frei` | bool | ja | Kost & Unterkunft kostenlos gestellt? |
| `kostenpflichtig` | bool | ja | muss die/der Freiwillige zahlen (Voluntourism)? |
| `teilnahmegebuehr_eur` | number\|null | nein | Gebühr in EUR, falls `kostenpflichtig` |
| `taschengeld_eur_monat` | number\|null | nein | Taschengeld pro Monat in EUR |
| `reisekosten_erstattet` | bool\|null | nein | Reisekosten erstattet? |
| `versicherung` | bool\|null | nein | Versicherung gestellt? |
| `sprachkurs` | bool\|null | nein | Sprachkurs inklusive? |
| `quelle` | string | ja | Quellname (z. B. `eurodesk`, `conservation-job-board`, `sci-workcamps`) |
| `quell_url` | string(url) | ja | Direktlink zur Stelle |
| `weitere_quell_urls` | string[] | ja | weitere URLs derselben Stelle (nach Dedup/Merge) |
| `quell_id` | string\|null | nein | ID/Slug in der Quelle |
| `erstmals_gesehen` | string(YYYY-MM-DD) | ja | erstes Auftauchen im Bestand |
| `zuletzt_gesehen` | string(YYYY-MM-DD) | ja | letzter Lauf, in dem die Stelle noch da war |
| `zuletzt_geaendert` | string(YYYY-MM-DD) | ja | letzte inhaltliche Änderung |

## Kontrolliertes Vokabular `taetigkeitsfeld`

`Naturschutz`, `Artenschutz/Tiere`, `Meeresschutz`, `Forschung/Feldassistenz`,
`Landwirtschaft/Permakultur`, `Wald/Forst`, `Umweltbildung`, `Klima/Nachhaltigkeit`,
`Sonstiges`.

Jede Quelle pflegt ein Mapping ihrer Rohkategorien → dieses Vokabular
(z. B. Eurodesk-Thema „Sustainability & Climate Change" → `Klima/Nachhaltigkeit`).

## Ableitungsregeln (Normalisierung)

- `kost_unterkunft_frei = true`, wenn Quelle „food & accommodation provided" o. ä. nennt
  **oder** `programm ∈ {ESC, IJFD, weltwärts}` (dort Standard).
- `kostenpflichtig = true`, sobald eine Programmgebühr/„program fee" erkennbar ist
  (typisch bei Voluntourism-Anbietern wie GVI, GoEco, IVHQ).
- Konflikt `kost_unterkunft_frei == true` **und** `kostenpflichtig == true` ist erlaubt
  (Gebühr deckt teils Unterkunft) — UI zeigt beides transparent an.
- `id` muss über Läufe hinweg stabil bleiben, damit `erstmals_gesehen`/Diffs funktionieren.
