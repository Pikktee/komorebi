from normalize import normalize_record
from sources import esc

# Verkürztes, aber strukturgetreues Abbild der echten ES-Antwort.
FIXTURE = {
    "hits": {
        "total": {"value": 2, "relation": "eq"},
        "hits": [
            {
                "_id": "50001",
                "_source": {
                    "opid": 50001,
                    "title": "Wiederaufforstung im Douro-Tal",
                    "organisation_name": "Associação Transumância e Natureza",
                    "country": "PT",
                    "town": "Vila Nova de Foz Côa",
                    "description": "Pflanzung heimischer Bäume, Brandschutz und "
                                   "Wildtier-Monitoring im Greater Côa Valley.",
                    "date_start": "2026-10-01T12:00:00",
                    "date_end": "2027-04-01T12:00:00",
                    "date_application_end": "2026-08-15T12:00:00",
                    "has_no_deadline": False,
                    "date_flexibility": "flexible",
                    "esc_topics": ["natr", "edu"],
                },
            },
            {
                "_id": "50002",
                "_source": {
                    "opid": 50002,
                    "title": "Meeresschutz auf den Seychellen",
                    "organisation_name": "Marine Conservation",
                    "country": "SC",
                    "town": "Mahé",
                    "description": "Korallenriff-Monitoring und Mangroven-Aufforstung.",
                    "date_start": "2026-09-01T12:00:00",
                    "date_end": "2027-09-01T12:00:00",
                    "has_no_deadline": True,
                    "date_flexibility": "fixed",
                    "esc_topics": ["natr"],
                },
            },
        ],
    }
}


def test_parse_liest_kernfelder():
    ergebnis = esc._parse(FIXTURE)
    assert len(ergebnis) == 2
    a = ergebnis[0]
    assert a["titel"] == "Wiederaufforstung im Douro-Tal"
    assert a["organisation"] == "Associação Transumância e Natureza"
    assert a["land"] == "Portugal"
    assert a["kontinent"] == "Europa"
    assert a["region"] == "Vila Nova de Foz Côa"
    assert a["programm"] == "ESC"
    assert a["quell_id"] == "50001"
    assert a["quell_url"] == "https://youth.europa.eu/solidarity/opportunity/50001_en"
    assert a["zeitraum_von"] == "2026-10-01"
    assert a["zeitraum_bis"] == "2027-04-01"
    assert a["bewerbungsfrist"] == "2026-08-15"
    assert a["flexibler_start"] is True
    assert a["voraussetzungen"]["hoechstalter"] == 30


def test_parse_traegt_helfer_fuer_eignung():
    a = esc._parse(FIXTURE)[0]
    assert a["_job_type"] == "volunteer"
    assert a["_kategorie"] == "esc-volunteering"


def test_parse_ohne_frist_setzt_keine_bewerbungsfrist():
    b = esc._parse(FIXTURE)[1]
    assert b["bewerbungsfrist"] is None
    assert b["flexibler_start"] is False
    assert b["land"] == "Seychellen"
    assert b["kontinent"] == "Afrika"


def test_normalize_macht_esc_stelle_gefoerdert():
    # programm=ESC => kost_unterkunft_frei abgeleitet True, _-Helfer fallen raus.
    roh = esc._parse(FIXTURE)[0]
    rec = normalize_record(roh, heute="2026-06-06")
    assert rec["programm"] == "ESC"
    assert rec["kost_unterkunft_frei"] is True
    assert rec["kostenpflichtig"] is False
    assert "_job_type" not in rec
    assert "_kategorie" not in rec


def test_serialisiere_qs_format():
    paare = dict(esc._serialisiere({"a": 1, "b": {"c": [True, "x"]}}))
    assert paare["a"] == "1"
    assert paare["b[c][0]"] == "true"
    assert paare["b[c][1]"] == "x"
