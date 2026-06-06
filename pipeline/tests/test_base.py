from sources.base import feld_aus_text, TAETIGKEITSFELDER


def test_feld_marine():
    assert feld_aus_text("Sea Turtle Monitoring Volunteer") == "Meeresschutz"


def test_feld_tiere():
    assert feld_aus_text("Avian Field Technician") == "Artenschutz/Tiere"


def test_feld_wald():
    assert feld_aus_text("Forest Restoration Intern") == "Wald/Forst"


def test_feld_bildung():
    assert feld_aus_text("Environmental Education Naturalist") == "Umweltbildung"


def test_feld_forschung():
    assert feld_aus_text("Research Assistant – Soil Survey") == "Forschung/Feldassistenz"


def test_feld_default_naturschutz():
    assert feld_aus_text("Irgendwas Unklares") == "Naturschutz"


def test_feld_immer_gueltig():
    for titel in ("xyz", "Coral Reef", "Wolf Tracking", "Climate Action"):
        assert feld_aus_text(titel) in TAETIGKEITSFELDER
