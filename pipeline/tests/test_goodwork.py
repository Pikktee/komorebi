from sources import goodwork


FIXTURE = """
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/volunteer/volunteer-coordinator-jobs-76167">Nature &amp; Conservation Support</a>,
      volunteer, Rouge Valley Conservation Centre, Toronto/GTA, Ontario
    </span>
  </div>
  <div class="two columns hide-mobile clearfix omega">
    <span title="Status: Open/apply now. Date posted: Jun 4, 2026.">
      <a href="/volunteer/volunteer-coordinator-jobs-76167"><img src="/x.jpg"></a>
    </span>
  </div>
</div>
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/a/grow-food-organic-farming-and-regenerative-agriculture-75537">Hands on The Land</a>,
      workstay program, vol. +accom., May to Oct., Abundance Community Farm, Agassiz BC / live on-site
    </span>
  </div>
</div>
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/volunteer/treasurer-positions-76169">Treasurer</a>,
      vol./board, Imagine Cities, remote, anywhere in Canada
    </span>
  </div>
</div>
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/a/wildlife-conservation-organizations-training-and-education-programs-58820">Wildlife conservation organizations</a>,
      volunteering, training, internships
    </span>
  </div>
</div>
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/a/organic-farm-volunteer-12345">Island Eco-Lodge Team Members</a>,
      work exchange, eco-lodge, Vancouver Island BC
    </span>
  </div>
</div>
<div class="listingthumb row">
  <div class="eight columns clearfix alpha">
    <span style="color:black;">
      <a href="/a/grow-food-12346">Grow food</a>,
      organic gardening resources, Canada
    </span>
  </div>
</div>
"""


def test_parse_filtert_und_normalisiert_kernfelder():
    out = goodwork._parse(FIXTURE)
    assert len(out) == 2

    a = out[0]
    assert a["titel"] == "Nature & Conservation Support"
    assert a["organisation"] == "Rouge Valley Conservation Centre"
    assert a["quell_id"] == "76167"
    assert a["quell_url"] == "https://www.goodwork.ca/volunteer/volunteer-coordinator-jobs-76167"
    assert a["land"] == "Kanada"
    assert a["kontinent"] == "Nordamerika"
    assert a["_job_type"] == "volunteer"


def test_parse_erkennt_unterkunftssignal():
    out = goodwork._parse(FIXTURE)
    farm = out[1]
    assert farm["organisation"] == "Abundance Community Farm"
    assert farm["kost_unterkunft_frei"] is True
    assert farm["land"] == "Kanada"


def test_geo_goodwork_verwechselt_vancouver_island_nicht_mit_island():
    land, region, kont = goodwork._geo_goodwork("North Vancouver Island BC", "")
    assert (land, kont) == ("Kanada", "Nordamerika")
    assert region == "North Vancouver Island BC"
