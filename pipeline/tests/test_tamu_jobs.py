from sources import tamu_jobs as tamu

FIXTURE = """
<div class="list-group">
  <a class="list-group-item list-group-item-action d-none d-xl-block active"
     id="job-114281-result" href="#job-114281">
    <h6>Seasonal Field Technician</h6>
    <p>Bird Conservancy of the Rockies</p>
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col text-end"> Application Deadline: </div>
        <div class="col"> 07/15/2026 </div>
        <div class="col text-end"> Salary: </div>
        <div class="col"> $15/hr, housing provided </div>
      </div>
      <div class="row align-items-center">
        <div class="col text-end"> Starting Date: </div>
        <div class="col"> 05/2026 </div>
        <div class="col text-end"> Experience Required: </div>
        <div class="col"> none </div>
        <div class="col text-end"> Location: </div>
        <div class="col"> 8GP+2 Brighton, CO, USA (Brighton, Colorado) </div>
      </div>
    </div>
  </a>
  <div class="list-group-item d-xl-none"><h6>Mobil-Duplikat</h6></div>
  <a class="list-group-item list-group-item-action d-none d-xl-block"
     id="job-114290-result" href="#job-114290">
    <h6>Wildlife Refuge Manager</h6>
    <p>US Fish &amp; Wildlife</p>
    <div class="container-fluid">
      <div class="row align-items-center">
        <div class="col text-end"> Location: </div>
        <div class="col"> Ottawa ON </div>
      </div>
    </div>
  </a>
</div>
"""


def test_parse_kernfelder():
    out = tamu._parse(FIXTURE)
    assert len(out) == 2  # nur die <a>-Cards, nicht das Mobil-Div
    a = out[0]
    assert a["titel"] == "Seasonal Field Technician"
    assert a["organisation"] == "Bird Conservancy of the Rockies"
    assert a["quell_id"] == "114281"
    assert a["quell_url"].endswith("/view-job/?id=114281")
    assert a["land"] == "USA"
    assert a["kontinent"] == "Nordamerika"
    assert a["region"] == "Brighton"
    assert a["bewerbungsfrist"] == "2026-07-15"
    assert "Vergütung: $15/hr, housing provided" in a["beschreibung"]
    assert a["taetigkeitsfeld"] == ["Artenschutz/Tiere"]  # "Bird" schlägt durch


def test_parse_geo_city_prov():
    out = tamu._parse(FIXTURE)
    assert out[1]["land"] == "Kanada"
    assert out[1]["region"] == "Ottawa"


def test_parse_setzt_titel_nicht_als_region_wenn_ort_fehlt():
    html = """
    <a class="list-group-item" id="job-1-result">
      <h6>Seasonal Field Technician</h6>
      <p>Field Station</p>
    </a>
    """
    out = tamu._parse(html)
    assert out[0]["land"] == ""
    assert out[0]["region"] is None
