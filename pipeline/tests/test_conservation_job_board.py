from sources import conservation_job_board as cjb

# Verkürztes, aber strukturgetreues Abbild der echten Listing-Artikel.
FIXTURE = """
<div class="results">
  <article>
    <header class="listing__job__header">
      <h2 class="listing__job__title">
        <a class="gtag-job-link" href="https://www.conservationjobboard.com/job-listing-x/123"
           job_id="111" location="california" categories="ecology-wildlife"
           experience="entry-level" job_type="temporary" company="acme">
           Sea Turtle Field Technician</a>
      </h2>
    </header>
    <h3>Acme Conservation</h3>
    <h4><i class="fas fa-map-marker-alt"></i> Dixon, CA</h4>
    <p class="listing__job__intro m-0 text-truncate"><span class="font-weight-light">Job type</span>: &nbsp; &nbsp;Temporary</p>
    <p class="listing__job__intro m-0 text-truncate"><span class="font-weight-light">Salary</span>: &nbsp; &nbsp;$18 per hour</p>
    <p class="listing__job__intro m-0"><span class="font-weight-light">Deadline</span>: &nbsp; &nbsp;Jun 15, 2026</p>
  </article>
  <article>
    <header class="listing__job__header">
      <h2 class="listing__job__title">
        <a class="gtag-job-link" href="https://www.conservationjobboard.com/job-listing-y/456"
           job_id="222" location="washington" categories="ecology"
           experience="high-level" job_type="permanent" company="state">
           Regional Wildlife Program Manager</a>
      </h2>
    </header>
    <h3>Department of Fish and Wildlife</h3>
    <h4><i class="fas fa-map-marker-alt"></i> Spokane, WA</h4>
    <p class="listing__job__intro m-0"><span class="font-weight-light">Job type</span>: &nbsp; &nbsp;Permanent</p>
  </article>
</div>
"""


def test_parse_liest_kernfelder():
    ergebnis = cjb._parse(FIXTURE, "Artenschutz/Tiere", "wildlife-jobs")
    assert len(ergebnis) == 2
    a = ergebnis[0]
    assert a["titel"] == "Sea Turtle Field Technician"
    assert a["organisation"] == "Acme Conservation"
    assert a["land"] == "USA"
    assert a["kontinent"] == "Nordamerika"
    assert a["region"] == "Dixon"
    assert a["taetigkeitsfeld"] == ["Artenschutz/Tiere"]
    assert a["_job_type"] == "temporary"
    assert a["quell_id"] == "111"
    assert a["bewerbungsfrist"] == "2026-06-15"
    assert "Vergütung: $18 per hour" in a["beschreibung"]


def test_parse_traegt_helfer_fuer_eignung():
    ergebnis = cjb._parse(FIXTURE, "Artenschutz/Tiere", "wildlife-jobs")
    permanent = ergebnis[1]
    assert permanent["_job_type"] == "permanent"
    assert permanent["_experience"] == "high-level"
    # Der Permanent-Job ist roh enthalten – erst die Eignungsprüfung verwirft ihn.
