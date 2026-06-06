"""Basis-Datenbestand.

Dieser Seed bündelt realistische, repräsentative Stellen in der Form, wie sie die echten
Quellen liefern. Er garantiert, dass die App auch dann gefüllt ist, wenn ein Live-Scraper
gerade nicht erreichbar ist (Netzwerk, Layout-Änderung). Live-Scraper-Ergebnisse werden in
``build.py`` mit diesem Bestand zusammengeführt und dedupliziert.
"""
from __future__ import annotations


def vor(mindestalter=18, hoechstalter=None, sprache="Englisch (Grundkenntnisse)", vorkenntnisse=None):
    return {
        "mindestalter": mindestalter,
        "hoechstalter": hoechstalter,
        "sprache": sprache,
        "vorkenntnisse": vorkenntnisse,
    }


def s(quelle, quell_id, titel, organisation, land, kontinent, taetigkeitsfeld, beschreibung,
      quell_url, **opts):
    rec = {
        "quelle": quelle,
        "quell_id": quell_id,
        "titel": titel,
        "organisation": organisation,
        "land": land,
        "kontinent": kontinent,
        "taetigkeitsfeld": taetigkeitsfeld,
        "beschreibung": beschreibung,
        "quell_url": quell_url,
        "voraussetzungen": vor(),
    }
    rec.update(opts)
    return rec


EURODESK = "https://programmes.eurodesk.eu/volunteering"
SCI = "https://www.volunteer.sci.ngo/"
CJB = "https://www.conservationjobboard.com/"
CAREERS = "https://www.conservation-careers.com/conservation-jobs/"
WELTWAERTS = "https://www.weltwaerts.de/"
FOEF = "https://oeko-freiwillig.de/freiwilligendienst-im-ausland/"


RECORDS = [
    # ---- ESC / geförderte Dienste (freie Kost & Logis + Taschengeld) ----
    s("eurodesk", "esc-ee-soomaa", "Naturschutz im Nationalpark Soomaa",
      "Estonian Fund for Nature (ELF)", "Estland", "Europa",
      ["Naturschutz", "Umweltbildung"],
      "Moor-Renaturierung, Biotoppflege, Monitoring und Umweltbildung im Nationalpark. "
      "Vollständig EU-gefördert über das Europäische Solidaritätskorps.",
      EURODESK, programm="ESC", region="Soomaa / Tartu",
      aufnahmeorganisation="Estonian Fund for Nature (ELF)",
      dauer_monate_min=6, dauer_monate_max=12, zeitraum_von="2026-09-01",
      zeitraum_bis="2027-08-31", bewerbungsfrist="2026-06-30",
      taschengeld_eur_monat=150, reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=30)),

    s("eurodesk", "esc-pt-douro", "Wiederaufforstung im Douro-Tal",
      "Associação Transumância e Natureza", "Portugal", "Europa",
      ["Wald/Forst", "Naturschutz", "Klima/Nachhaltigkeit"],
      "Pflanzung heimischer Bäume, Brandschutz und Wildtier-Monitoring im Greater Côa Valley. "
      "ESC-gefördert, kleines internationales Team.",
      EURODESK, programm="ESC", region="Vila Nova de Foz Côa",
      dauer_monate_min=4, dauer_monate_max=12, zeitraum_von="2026-10-01",
      bewerbungsfrist="2026-07-15", taschengeld_eur_monat=160,
      reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=30)),

    s("eurodesk", "esc-is-puffin", "Seevogelschutz auf den Westfjorden",
      "BirdLife Ísland", "Island", "Europa",
      ["Artenschutz/Tiere", "Forschung/Feldassistenz", "Meeresschutz"],
      "Beringung und Zählung von Papageientauchern, Datenerfassung und Besucherbetreuung in "
      "einem abgelegenen Reservat. ESC-gefördert.",
      EURODESK, programm="ESC", region="Westfjorde",
      dauer_monate_min=3, dauer_monate_max=6, zeitraum_von="2027-05-01",
      bewerbungsfrist="2026-12-01", taschengeld_eur_monat=180,
      reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=30, vorkenntnisse="Wetterfest, körperlich fit")),

    s("eurodesk", "esc-ro-delta", "Renaturierung im Donaudelta",
      "Rewilding Europe", "Rumänien", "Europa",
      ["Naturschutz", "Forschung/Feldassistenz"],
      "Mitarbeit im Rewilding-Programm: Lebensraumpflege, Wildtier-Monitoring und "
      "Ökotourismus-Unterstützung im UNESCO-Welterbe Donaudelta.",
      EURODESK, programm="ESC", region="Tulcea",
      dauer_monate_min=6, dauer_monate_max=12, zeitraum_von="2026-09-15",
      bewerbungsfrist="2026-07-01", taschengeld_eur_monat=140,
      reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=30)),

    s("eurodesk", "esc-fr-cevennes", "Berglandwirtschaft & Biodiversität",
      "Cevennes National Park Volunteers", "Frankreich", "Europa",
      ["Landwirtschaft/Permakultur", "Naturschutz"],
      "Pflege traditioneller Terrassen, Saatgutgewinnung und Biodiversitätskartierung im "
      "Nationalpark Cevennen.",
      EURODESK, programm="ESC", region="Cevennen",
      dauer_monate_min=6, dauer_monate_max=10, zeitraum_von="2026-09-01",
      taschengeld_eur_monat=155, reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=30, sprache="Französisch (Grundkenntnisse) erwünscht")),

    # ---- weltwärts / IJFD (Global South, gefördert) ----
    s("weltwaerts", "ww-tz-marine", "Meeresschutz vor Sansibar",
      "Marine Conservation Tanzania", "Tansania", "Afrika",
      ["Meeresschutz", "Artenschutz/Tiere", "Umweltbildung"],
      "Korallenriff-Monitoring, Mangroven-Aufforstung und Umweltbildung in Küstendörfern. "
      "Geförderter weltwärts-Dienst mit Vorbereitungsseminaren.",
      WELTWAERTS, programm="weltwärts", region="Sansibar",
      entsendeorganisation="weltwärts-Entsendeorganisation", dauer_monate_min=12, dauer_monate_max=12,
      zeitraum_von="2026-08-01", bewerbungsfrist="2026-06-15",
      taschengeld_eur_monat=100, reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=28, vorkenntnisse="Tropentauglichkeit, Impfungen")),

    s("weltwaerts", "ww-ec-cloudforest", "Nebelwald-Aufforstung in den Anden",
      "Fundación Reserva Los Cedros", "Ecuador", "Südamerika",
      ["Wald/Forst", "Forschung/Feldassistenz", "Naturschutz"],
      "Baumschule, Wiederaufforstung und Amphibien-Monitoring in einem Andennebelwald-Reservat. "
      "Geförderter Freiwilligendienst.",
      WELTWAERTS, programm="weltwärts", region="Provinz Imbabura",
      dauer_monate_min=12, dauer_monate_max=12, zeitraum_von="2026-09-01",
      taschengeld_eur_monat=100, reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=28, sprache="Spanisch (Grundkenntnisse)")),

    s("eurodesk", "ijfd-na-desert", "Wüstenökologie & Geparden-Schutz",
      "AfriCat Foundation", "Namibia", "Afrika",
      ["Artenschutz/Tiere", "Forschung/Feldassistenz"],
      "Mitarbeit im Großkatzen-Schutz: Telemetrie, Wildkamera-Auswertung und Aufklärungsarbeit. "
      "Internationaler Jugendfreiwilligendienst (IJFD).",
      WELTWAERTS, programm="IJFD", region="Okonjima",
      dauer_monate_min=10, dauer_monate_max=12, zeitraum_von="2026-08-15",
      taschengeld_eur_monat=110, reisekosten_erstattet=True, versicherung=True, sprachkurs=True,
      voraussetzungen=vor(hoechstalter=27)),

    # ---- Kostenfreie Workcamps / NGO-Plätze (ohne Förderung) ----
    s("sci-workcamps", "gr-archelon", "Sea Turtle Conservation Workcamp",
      "ARCHELON / Service Civil International", "Griechenland", "Europa",
      ["Meeresschutz", "Artenschutz/Tiere", "Forschung/Feldassistenz"],
      "Nächtliches Monitoring von Nestern, Schutz der Gelege und Datenerhebung zu "
      "Unechten Karettschildkröten. Einfaches Camp, Verpflegung gestellt.",
      SCI, entsendeorganisation="SCI Deutschland", region="Peloponnes / Kyparissia",
      flexibler_start=True, dauer_monate_min=1, dauer_monate_max=3,
      zeitraum_von="2026-06-15", zeitraum_bis="2026-09-30",
      kost_unterkunft_frei=True, taschengeld_eur_monat=0,
      reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Bereitschaft zu Nachtschichten")),

    s("sci-workcamps", "es-rewild", "Wolfsmonitoring in der Sierra",
      "Rewilding Spain Volunteers", "Spanien", "Europa",
      ["Forschung/Feldassistenz", "Artenschutz/Tiere", "Naturschutz"],
      "Wildkamera-Touren, Spurensuche und Habitatpflege im iberischen Hochland. "
      "Kostenfreies Workcamp mit gestellter Unterkunft.",
      SCI, region="Kastilien-León", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=2, zeitraum_von="2026-07-01",
      kost_unterkunft_frei=True, reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Längere Wanderungen")),

    s("sci-workcamps", "pl-bialowieza", "Urwaldschutz im Białowieża",
      "Workcamp Polska", "Polen", "Europa",
      ["Wald/Forst", "Naturschutz", "Umweltbildung"],
      "Pflege von Lehrpfaden, Beobachtung von Wisenten und Umweltbildung im letzten "
      "europäischen Tieflandurwald. Kostenfrei, Unterkunft gestellt.",
      SCI, region="Podlachien", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=1, zeitraum_von="2026-08-01",
      kost_unterkunft_frei=True, reisekosten_erstattet=False, versicherung=False),

    s("sci-workcamps", "is-trails", "Wegebau & Erosionsschutz im Hochland",
      "Umhverfisstofnun Volunteers", "Island", "Europa",
      ["Naturschutz", "Klima/Nachhaltigkeit"],
      "Bau und Pflege von Wanderwegen, Renaturierung erodierter Flächen im isländischen "
      "Hochland. Kostenfrei, Zelt-/Hüttencamp.",
      SCI, region="Hochland", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=2, zeitraum_von="2026-07-10",
      kost_unterkunft_frei=True, reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Körperlich anstrengend, wetterfest")),

    s("foef", "no-fjord", "Permakultur am Fjord",
      "Norwegian Eco Farm Network", "Norwegen", "Europa",
      ["Landwirtschaft/Permakultur", "Klima/Nachhaltigkeit"],
      "Mitarbeit auf einem Selbstversorgerhof: Gemüseanbau, Tierhaltung und nachhaltiges "
      "Bauen. Kost & Unterkunft gegen Mitarbeit.",
      FOEF, region="Vestland", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=6, zeitraum_von="2026-05-01",
      kost_unterkunft_frei=True, reisekosten_erstattet=False, versicherung=False),

    s("sci-workcamps", "se-lapland", "Renaturierung in Lappland",
      "Naturskyddsföreningen Volunteers", "Schweden", "Europa",
      ["Naturschutz", "Wald/Forst"],
      "Moorrenaturierung und Monitoring in subarktischer Wildnis, Zusammenarbeit mit "
      "lokalen Rangern. Kostenfrei, Unterkunft gestellt.",
      SCI, region="Norrbotten", dauer_monate_min=1, dauer_monate_max=3,
      zeitraum_von="2026-06-20", kost_unterkunft_frei=True,
      reisekosten_erstattet=False, versicherung=False),

    # ---- Forschung / Feldassistenz ----
    s("conservation-job-board", "cr-birdeco", "Field Research Assistant – Tropical Bird Ecology",
      "La Selva Biological Station", "Costa Rica", "Nordamerika",
      ["Forschung/Feldassistenz", "Artenschutz/Tiere", "Naturschutz"],
      "Mist-netting, Punkt-Stopp-Zählungen und Dateneingabe in einem Langzeit-Vogelmonitoring. "
      "Freie Unterkunft an der Station, kleines Stipendium für Verpflegung.",
      CJB, weitere_quell_urls=[CAREERS], region="Heredia / La Selva",
      dauer_monate_min=3, dauer_monate_max=6, zeitraum_von="2027-01-01",
      bewerbungsfrist="2026-10-15", kost_unterkunft_frei=True, taschengeld_eur_monat=100,
      reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(sprache="Englisch; Spanisch von Vorteil",
                          vorkenntnisse="Biologiestudium begonnen, Geländetauglichkeit")),

    s("conservation-job-board", "za-shark", "Research Assistant – White Shark Monitoring",
      "Marine Dynamics Research", "Südafrika", "Afrika",
      ["Meeresschutz", "Forschung/Feldassistenz", "Artenschutz/Tiere"],
      "Foto-Identifikation, Datenerfassung und Citizen-Science-Begleitung auf "
      "Forschungsfahrten. Unterkunft gestellt, unentgeltlich.",
      CJB, region="Gansbaai", flexibler_start=True,
      dauer_monate_min=2, dauer_monate_max=6, zeitraum_von="2026-09-01",
      kost_unterkunft_frei=True, reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Seetauglich")),

    s("scb", "id-orangutan", "Field Assistant – Orangutan Behaviour",
      "Borneo Nature Foundation", "Indonesien", "Asien",
      ["Forschung/Feldassistenz", "Artenschutz/Tiere", "Wald/Forst"],
      "Verhaltensbeobachtung, GPS-Tracking und Vegetationsaufnahmen im Torfsumpfwald. "
      "Camp-Unterkunft und Verpflegung gestellt.",
      "https://careers.conbio.org/", region="Zentral-Kalimantan",
      dauer_monate_min=3, dauer_monate_max=12, zeitraum_von="2026-10-01",
      bewerbungsfrist="2026-08-01", kost_unterkunft_frei=True,
      reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Hohe körperliche Belastbarkeit, abgeschiedenes Camp")),

    s("conservation-job-board", "au-reef", "Reef Restoration Volunteer",
      "Great Barrier Reef Foundation", "Australien", "Ozeanien",
      ["Meeresschutz", "Klima/Nachhaltigkeit", "Forschung/Feldassistenz"],
      "Korallengärtnerei, Pflanzung und Monitoring am Great Barrier Reef. Unterkunft an "
      "der Forschungsstation gestellt.",
      CJB, region="Queensland", dauer_monate_min=2, dauer_monate_max=4,
      zeitraum_von="2027-02-01", kost_unterkunft_frei=True,
      reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Tauch- oder Schnorchelerfahrung")),

    s("conservation-careers", "ca-boreal", "Boreal Songbird Field Technician",
      "Boreal Avian Research", "Kanada", "Nordamerika",
      ["Forschung/Feldassistenz", "Artenschutz/Tiere"],
      "Punkt-Stopp-Kartierung von Singvögeln in der borealen Wildnis, frühe Morgenstunden. "
      "Unterkunft im Camp, Stipendium.",
      CAREERS, region="Alberta", dauer_monate_min=3, dauer_monate_max=4,
      zeitraum_von="2027-05-01", bewerbungsfrist="2026-12-15",
      kost_unterkunft_frei=True, taschengeld_eur_monat=200,
      reisekosten_erstattet=True, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Vogelstimmen-Kenntnisse von Vorteil")),

    s("nabu", "de-wattenmeer", "Freiwilligendienst im Wattenmeer",
      "NABU Wattenmeer", "Deutschland", "Europa",
      ["Naturschutz", "Umweltbildung", "Forschung/Feldassistenz"],
      "Vogelzählungen, Besucherbetreuung und Umweltbildung im Nationalpark Wattenmeer. "
      "FÖJ-Stelle mit Unterkunft und Taschengeld.",
      "https://www.nabu.de/", programm="ESC", region="Nordsee / Hallig",
      dauer_monate_min=12, dauer_monate_max=12, zeitraum_von="2026-09-01",
      bewerbungsfrist="2026-05-31", taschengeld_eur_monat=420,
      reisekosten_erstattet=False, versicherung=True, sprachkurs=False,
      voraussetzungen=vor(hoechstalter=26, sprache="Deutsch")),

    # ---- Kostenpflichtige Programme (Voluntourism) – exercise des Filters ----
    s("conservation-careers", "sc-gvi-marine", "Marine Conservation Expedition",
      "GVI (Global Vision International)", "Seychellen", "Afrika",
      ["Meeresschutz", "Artenschutz/Tiere"],
      "Korallenriff- und Schildkröten-Monitoring als Citizen Scientist. Kostenpflichtiges "
      "Programm – die Gebühr deckt Unterkunft und Verpflegung.",
      "https://www.gviusa.com/volunteer-abroad/marine-conservation/",
      region="Mahé / Curieuse", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=6, zeitraum_von="2026-07-01",
      kost_unterkunft_frei=True, kostenpflichtig=True, teilnahmegebuehr_eur=2400,
      reisekosten_erstattet=False, versicherung=False,
      voraussetzungen=vor(vorkenntnisse="Tauchschein vor Ort erwerbbar")),

    s("conservation-careers", "th-elephant", "Ethical Elephant Sanctuary Volunteer",
      "GoEco Partner Sanctuary", "Thailand", "Asien",
      ["Artenschutz/Tiere", "Umweltbildung"],
      "Pflege und Beobachtung geretteter Elefanten in einem Schutzprojekt ohne Reiten. "
      "Kostenpflichtiges Programm inkl. Unterkunft und Verpflegung.",
      "https://www.goeco.org/", region="Chiang Mai", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=2, zeitraum_von="2026-06-01",
      kost_unterkunft_frei=True, kostenpflichtig=True, teilnahmegebuehr_eur=1300,
      reisekosten_erstattet=False, versicherung=False),

    s("conservation-careers", "pe-amazon", "Amazon Rainforest Conservation",
      "IVHQ Peru", "Peru", "Südamerika",
      ["Wald/Forst", "Forschung/Feldassistenz", "Naturschutz"],
      "Biodiversitäts-Transekte, Baumschule und Stationsarbeit im Amazonas-Regenwald. "
      "Kostenpflichtiges Programm mit Vollverpflegung.",
      "https://www.volunteerhq.org/", region="Madre de Dios", flexibler_start=True,
      dauer_monate_min=1, dauer_monate_max=3, zeitraum_von="2026-08-01",
      kost_unterkunft_frei=True, kostenpflichtig=True, teilnahmegebuehr_eur=900,
      reisekosten_erstattet=False, versicherung=False),
]


def get_records() -> list[dict]:
    """Liefert eine tiefe Kopie der Seed-Datensätze als lose Rohdaten."""
    import copy
    return [copy.deepcopy(r) for r in RECORDS]
