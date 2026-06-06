import llm


def test_ohne_key_keine_aussage(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    records = [{"titel": "a"}, {"titel": "b"}, {"titel": "c"}]
    ergebnis = llm.klassifiziere(records, api_key=None)
    assert ergebnis == [None, None, None]


def test_verfuegbar(monkeypatch):
    gueltig = "sk-or-v1-" + "a" * 40
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    assert llm.verfuegbar() is False
    assert llm.verfuegbar(gueltig) is True
    monkeypatch.setenv("OPENROUTER_API_KEY", gueltig)
    assert llm.verfuegbar() is True


def test_json_aus_text_direkt():
    assert llm._json_aus_text('{"a": 1}') == {"a": 1}


def test_json_aus_text_mit_geschwaetz():
    roh = 'Klar! Hier ist die Antwort:\n```json\n{"ergebnisse": []}\n```\nViel Erfolg!'
    assert llm._json_aus_text(roh) == {"ergebnisse": []}


def test_leere_eingabe():
    assert llm.klassifiziere([], api_key="sk-or-v1-" + "a" * 40) == []


def test_platzhalter_key_wird_erkannt(monkeypatch):
    monkeypatch.delenv("OPENROUTER_API_KEY", raising=False)
    # Platzhalter mit „…" (nicht ASCII-kodierbar -> würde Header sprengen)
    assert llm.verfuegbar("sk-or-…") is False
    assert llm.verfuegbar("sk-or-...") is False
    assert llm.verfuegbar("irgendwas") is False
    assert llm.verfuegbar("sk-or-v1-" + "a" * 40) is True


def test_klassifiziere_mit_platzhalter_kein_crash():
    # darf nicht werfen, sondern sauber None liefern
    out = llm.klassifiziere([{"titel": "x"}], api_key="sk-or-…")
    assert out == [None]
