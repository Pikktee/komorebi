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
