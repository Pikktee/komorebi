from normalize import normalize_record
from sources.base import SCHEMA_FELDER, VORAUSSETZUNGEN_FELDER


def _basis(**opts):
    raw = {
        "quelle": "test",
        "quell_id": "x1",
        "quell_url": "https://example.org/x1",
        "titel": "Teststelle",
        "organisation": "Test e.V.",
        "land": "Estland",
        "kontinent": "Europa",
        "taetigkeitsfeld": ["Naturschutz"],
        "beschreibung": "Beschreibung",
    }
    raw.update(opts)
    return raw


def test_schema_vollstaendig():
    rec = normalize_record(_basis())
    assert set(rec.keys()) == set(SCHEMA_FELDER)
    assert set(rec["voraussetzungen"].keys()) == set(VORAUSSETZUNGEN_FELDER)


def test_foerderprogramm_impliziert_freie_kost():
    rec = normalize_record(_basis(programm="ESC"))
    assert rec["kost_unterkunft_frei"] is True
    assert rec["kostenpflichtig"] is False


def test_teilnahmegebuehr_impliziert_kostenpflichtig():
    rec = normalize_record(_basis(teilnahmegebuehr_eur=900))
    assert rec["kostenpflichtig"] is True


def test_expliziter_wert_wird_nicht_ueberschrieben():
    rec = normalize_record(_basis(programm="ESC", kost_unterkunft_frei=False))
    assert rec["kost_unterkunft_frei"] is False


def test_unbekanntes_taetigkeitsfeld_wird_sonstiges():
    rec = normalize_record(_basis(taetigkeitsfeld=["Quatsch"]))
    assert rec["taetigkeitsfeld"] == ["Sonstiges"]


def test_unbekanntes_programm_faellt_auf_keins_zurueck():
    rec = normalize_record(_basis(programm="Phantasie"))
    assert rec["programm"] == "keins"
    assert rec["kost_unterkunft_frei"] is False


def test_zeitstempel_und_stabile_id():
    rec = normalize_record(_basis(), heute="2026-06-05")
    assert rec["erstmals_gesehen"] == "2026-06-05"
    assert rec["zuletzt_gesehen"] == "2026-06-05"
    assert rec["id"] == normalize_record(_basis())["id"]  # stabil über Läufe


def test_erstsichtung_bleibt_erhalten():
    rec = normalize_record(_basis(erstmals_gesehen="2026-01-01"), heute="2026-06-05")
    assert rec["erstmals_gesehen"] == "2026-01-01"
    assert rec["zuletzt_gesehen"] == "2026-06-05"
