import build


def test_entscheide_llm_strict():
    assert build.entscheide_llm(strict=True, auto=False, key_ok=True) == "an"
    assert build.entscheide_llm(strict=True, auto=False, key_ok=False) == "fehler"


def test_entscheide_llm_auto():
    assert build.entscheide_llm(strict=False, auto=True, key_ok=True) == "an"
    assert build.entscheide_llm(strict=False, auto=True, key_ok=False) == "auto-ohne-key"


def test_entscheide_llm_aus():
    assert build.entscheide_llm(strict=False, auto=False, key_ok=True) == "aus"
    assert build.entscheide_llm(strict=False, auto=False, key_ok=False) == "aus"


def test_generische_quell_url_erkannt():
    assert build.ist_generische_quell_url({"quell_url": "https://programmes.eurodesk.eu/volunteering/"})
    assert not build.ist_generische_quell_url({
        "quell_url": "https://www.conservationjobboard.com/job-listing-demo/123"
    })


def test_schwelle_schlaegt_bei_einbruch_an():
    # 232 nach zuvor 445 (ESC weggebrochen) -> unter 70 % -> Abbruch.
    assert build.unterschreitet_schwelle(232, 445)


def test_schwelle_laesst_normale_schwankung_durch():
    # Leichter Rückgang (abgelaufene Stellen) bleibt über der Schwelle.
    assert not build.unterschreitet_schwelle(420, 445)
    assert not build.unterschreitet_schwelle(445, 445)


def test_schwelle_ohne_vorstand_nie_aktiv():
    # Erstlauf: kein guter Stand zu schützen -> nie Abbruch.
    assert not build.unterschreitet_schwelle(0, 0)
    assert not build.unterschreitet_schwelle(5, 0)
