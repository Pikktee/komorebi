import dedup
from normalize import normalize_record


def _rec(quelle, url, titel="Schildkrötenschutz", org="ARCHELON", land="Griechenland",
         erstmals="2026-06-05"):
    return normalize_record({
        "quelle": quelle,
        "quell_url": url,
        "titel": titel,
        "organisation": org,
        "land": land,
        "kontinent": "Europa",
        "taetigkeitsfeld": ["Meeresschutz"],
        "beschreibung": "x",
        "erstmals_gesehen": erstmals,
    })


def test_gleiche_stelle_wird_zusammengefuehrt():
    a = _rec("sci-workcamps", "https://a.example/1", erstmals="2026-05-01")
    b = _rec("eurodesk", "https://b.example/2", erstmals="2026-06-05")
    ergebnis = dedup.merge([a, b])
    assert len(ergebnis) == 1
    assert "https://b.example/2" in ergebnis[0]["weitere_quell_urls"]
    # frühestes Erstsichtungsdatum bleibt erhalten
    assert ergebnis[0]["erstmals_gesehen"] == "2026-05-01"


def test_gleiche_url_wird_auch_bei_abweichendem_text_zusammengefuehrt():
    a = _rec("quelle-a", "https://example.org/angebot/123", titel="Sea Turtle Volunteer", org="ARCHELON")
    b = _rec("quelle-b", "https://example.org/angebot/123/", titel="Schildkröten-Workcamp", org="SCI")
    c = _rec("quelle-c", "https://example.org/angebot/456", titel="Schildkröten-Workcamp", org="SCI")
    ergebnis = dedup.merge([a, b, c])
    assert len(ergebnis) == 1
    assert ergebnis[0]["titel"] == "Sea Turtle Volunteer"
    assert "https://example.org/angebot/456" in ergebnis[0]["weitere_quell_urls"]


def test_unterschiedliche_titel_bleiben_getrennt():
    a = _rec("sci-workcamps", "https://a.example/1", titel="Schildkrötenschutz")
    b = _rec("sci-workcamps", "https://a.example/2", titel="Wolfsmonitoring")
    ergebnis = dedup.merge([a, b])
    assert len(ergebnis) == 2


def test_reihenfolge_bleibt_stabil():
    a = _rec("q", "https://a/1", titel="Aaa")
    b = _rec("q", "https://a/2", titel="Bbb")
    c = _rec("q", "https://a/3", titel="Ccc")
    ergebnis = dedup.merge([a, b, c])
    assert [r["titel"] for r in ergebnis] == ["Aaa", "Bbb", "Ccc"]
