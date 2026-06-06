import eignung


def test_permanent_wird_verworfen():
    status, _ = eignung.bewerten({"titel": "Wildlife Biologist", "_job_type": "permanent"})
    assert status == "ungeeignet"


def test_faculty_postdoc_wird_verworfen():
    status, _ = eignung.bewerten({"titel": "Assistant Professor", "_job_type": "faculty-postdoc"})
    assert status == "ungeeignet"


def test_karriere_titel_wird_verworfen():
    status, _ = eignung.bewerten({"titel": "Regional Wildlife Program Manager", "_job_type": ""})
    assert status == "ungeeignet"


def test_praktikum_ist_geeignet():
    status, _ = eignung.bewerten({"titel": "Sea Turtle Intern", "_job_type": "paid-internship"})
    assert status == "geeignet"


def test_saisonstelle_ist_geeignet():
    status, _ = eignung.bewerten({"titel": "Field Technician", "_job_type": "temporary"})
    assert status == "geeignet"


def test_volunteer_titel_ohne_jobtyp_ist_geeignet():
    status, _ = eignung.bewerten({"titel": "Conservation Volunteer", "_job_type": ""})
    assert status == "geeignet"


def test_seed_ist_immer_geeignet():
    status, grund = eignung.bewerten({"titel": "egal", "quelle": "seed", "_job_type": "permanent"})
    assert status == "geeignet"
    assert grund == "kuratiert"


def test_unklar_ohne_signal():
    status, _ = eignung.bewerten({"titel": "Watershed Associate", "_job_type": ""})
    assert status == "unklar"


def test_positives_signal_schlaegt_schwache_negativ_heuristik():
    # "Lead" ist schwach negativ, aber Praktikum-Jobtyp ist klar positiv
    status, _ = eignung.bewerten({"titel": "Lead Field Intern", "_job_type": "internship"})
    assert status == "geeignet"


def test_harter_negativ_titel_schlaegt_positiven_jobtyp():
    # befristete Leitungsstelle: "Manager" verwirft trotz positivem job_type
    status, _ = eignung.bewerten({"titel": "Nature Project Manager", "_job_type": "temporary"})
    assert status == "ungeeignet"
