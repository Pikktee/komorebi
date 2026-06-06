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
