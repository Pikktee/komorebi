from sources import geo


def test_us_stadt_mit_kuerzel():
    land, region, kont = geo.aufloesen("Dixon, CA")
    assert land == "USA"
    assert kont == "Nordamerika"
    assert region == "Dixon"


def test_us_bundesstaat_slug():
    assert geo.aufloesen("south-carolina")[0] == "USA"
    assert geo.aufloesen("california")[::2] == ("USA", "Nordamerika")


def test_kanada():
    land, _region, kont = geo.aufloesen("Vancouver, British Columbia")
    assert land == "Kanada"
    assert kont == "Nordamerika"


def test_mehrteiliges_land_ohne_komma():
    assert geo.aufloesen("South Africa")[0] == "Südafrika"
    assert geo.aufloesen("new zealand")[0] == "Neuseeland"


def test_stadt_komma_land():
    land, region, kont = geo.aufloesen("Cape Town, South Africa")
    assert (land, kont) == ("Südafrika", "Afrika")
    assert region == "Cape Town"


def test_deutsche_und_englische_namen():
    assert geo.aufloesen("Costa Rica")[0] == "Costa Rica"
    assert geo.aufloesen("Kenya")[0] == "Kenia"
    assert geo.aufloesen("Deutschland")[0] == "Deutschland"


def test_galapagos_zaehlt_zu_ecuador():
    assert geo.aufloesen("Galápagos")[0] == "Ecuador"


def test_bolivian_und_singapore():
    assert geo.aufloesen("Bolivian Amazon")[0] == "Bolivien"
    assert geo.aufloesen("Singapore")[0] == "Singapur"


def test_unscharfe_aliase_sind_nicht_zu_gierig():
    assert geo.aufloesen("Costa Rica, Central America")[0] == "Costa Rica"
    assert geo.aufloesen("North Vancouver Island")[0] == ""


def test_platzhalter_liefern_kein_land():
    for p in ("Remote", "Various Locations", "Worldwide", "", "  "):
        assert geo.aufloesen(p) == ("", None, "")


def test_unbekannter_ort():
    land, region, kont = geo.aufloesen("Hobbingen")
    assert land == ""
    assert kont == ""
    assert region == "Hobbingen"


def test_uk_teile():
    assert geo.aufloesen("Edinburgh, Scotland")[0] == "Vereinigtes Königreich"


def test_city_prov_ohne_komma_kanada():
    land, region, kont = geo.aufloesen("Ottawa ON")
    assert (land, kont) == ("Kanada", "Nordamerika")
    assert region == "Ottawa"


def test_city_state_ohne_komma_usa():
    land, region, kont = geo.aufloesen("Fredonia TX")
    assert (land, kont) == ("USA", "Nordamerika")
    assert region == "Fredonia"


def test_city_prov_mit_slash():
    assert geo.aufloesen("Manotick / Greater Ottawa ON")[0] == "Kanada"


def test_laendercode_basis():
    assert geo.aus_laendercode("FR") == ("Frankreich", None, "Europa")
    assert geo.aus_laendercode("UG") == ("Uganda", None, "Afrika")
    assert geo.aus_laendercode("CR") == ("Costa Rica", None, "Nordamerika")
    assert geo.aus_laendercode("EC") == ("Ecuador", None, "Südamerika")


def test_laendercode_kollidiert_nicht_mit_us_staaten():
    # "DE"=Delaware, "GA"=Georgia, "GE"=Georgia(US-Slug) – als ISO-Code andere Länder.
    assert geo.aus_laendercode("DE") == ("Deutschland", None, "Europa")
    assert geo.aus_laendercode("GE") == ("Georgien", None, "Asien")


def test_laendercode_eu_sonderfaelle():
    assert geo.aus_laendercode("EL")[0] == "Griechenland"  # EU nutzt EL statt GR
    assert geo.aus_laendercode("UK")[0] == "Vereinigtes Königreich"


def test_laendercode_kleinschreibung_und_unbekannt():
    assert geo.aus_laendercode("tr") == ("Türkei", None, "Asien")
    assert geo.aus_laendercode("ZZ") == ("", None, "")
    assert geo.aus_laendercode("") == ("", None, "")
    assert geo.aus_laendercode(None) == ("", None, "")
