import { describe, expect, it } from 'vitest';
import {
  DEFAULT_FILTER,
  filterStellen,
  filterToParams,
  parseFilter,
  type Filter,
} from './filter';
import type { Stelle } from '../types';

function stelle(p: Partial<Stelle>): Stelle {
  return {
    id: p.id ?? 'x',
    titel: p.titel ?? 'Titel',
    organisation: p.organisation ?? 'Org',
    aufnahmeorganisation: null,
    entsendeorganisation: null,
    land: p.land ?? 'Estland',
    region: p.region ?? null,
    kontinent: p.kontinent ?? 'Europa',
    dauer_monate_min: p.dauer_monate_min ?? null,
    dauer_monate_max: p.dauer_monate_max ?? null,
    zeitraum_von: null,
    zeitraum_bis: null,
    flexibler_start: false,
    taetigkeitsfeld: p.taetigkeitsfeld ?? ['Naturschutz'],
    beschreibung: p.beschreibung ?? '',
    bewerbungsfrist: p.bewerbungsfrist ?? null,
    voraussetzungen: { mindestalter: null, hoechstalter: null, sprache: null, vorkenntnisse: null },
    programm: p.programm ?? 'keins',
    kost_unterkunft_frei: p.kost_unterkunft_frei ?? true,
    kostenpflichtig: p.kostenpflichtig ?? false,
    teilnahmegebuehr_eur: p.teilnahmegebuehr_eur ?? null,
    taschengeld_eur_monat: null,
    reisekosten_erstattet: null,
    versicherung: null,
    sprachkurs: null,
    quelle: 'test',
    quell_url: 'https://example.org',
    weitere_quell_urls: [],
    quell_id: null,
    erstmals_gesehen: p.erstmals_gesehen ?? '2026-06-05',
    zuletzt_gesehen: '2026-06-05',
    zuletzt_geaendert: '2026-06-05',
    geo_lat: p.geo_lat ?? null,
    geo_lon: p.geo_lon ?? null,
    geo_genauigkeit: p.geo_genauigkeit ?? null,
    geo_label: p.geo_label ?? null,
  };
}

const daten: Stelle[] = [
  stelle({ id: 'a', land: 'Estland', taetigkeitsfeld: ['Naturschutz'], programm: 'ESC', dauer_monate_min: 6 }),
  stelle({ id: 'b', land: 'Griechenland', taetigkeitsfeld: ['Meeresschutz'], dauer_monate_min: 1 }),
  stelle({ id: 'c', land: 'Thailand', kontinent: 'Asien', kostenpflichtig: true, teilnahmegebuehr_eur: 900, dauer_monate_min: 1 }),
  stelle({ id: 'd', land: 'Costa Rica', kontinent: 'Nordamerika', taetigkeitsfeld: ['Forschung/Feldassistenz'], dauer_monate_min: 3 }),
];

describe('filterStellen', () => {
  it('blendet kostenpflichtige standardmäßig aus', () => {
    const r = filterStellen(daten, DEFAULT_FILTER);
    expect(r.map((s) => s.id)).not.toContain('c');
    expect(r).toHaveLength(3);
  });

  it('zeigt kostenpflichtige, wenn ohneGebuehr=false', () => {
    const r = filterStellen(daten, { ...DEFAULT_FILTER, ohneGebuehr: false });
    expect(r.map((s) => s.id)).toContain('c');
  });

  it('filtert nach Land', () => {
    const r = filterStellen(daten, { ...DEFAULT_FILTER, laender: ['Estland'] });
    expect(r).toHaveLength(1);
    expect(r[0].id).toBe('a');
  });

  it('filtert nach Tätigkeitsfeld (Schnittmenge)', () => {
    const r = filterStellen(daten, { ...DEFAULT_FILTER, felder: ['Meeresschutz'] });
    expect(r.map((s) => s.id)).toEqual(['b']);
  });

  it('Freitextsuche trifft Land und Feld', () => {
    expect(filterStellen(daten, { ...DEFAULT_FILTER, q: 'meeres' }).map((s) => s.id)).toEqual(['b']);
    expect(filterStellen(daten, { ...DEFAULT_FILTER, q: 'costa' }).map((s) => s.id)).toEqual(['d']);
  });

  it('dauerMax begrenzt auf kurze Mindestdauer', () => {
    const r = filterStellen(daten, { ...DEFAULT_FILTER, dauerMax: 1 });
    expect(r.map((s) => s.id).sort()).toEqual(['b']);
  });

  it('sortiert nach Land alphabetisch', () => {
    const r = filterStellen(daten, { ...DEFAULT_FILTER, ohneGebuehr: false, sort: 'land' });
    expect(r.map((s) => s.land)).toEqual(['Costa Rica', 'Estland', 'Griechenland', 'Thailand']);
  });

  it('sortiert standardmäßig nach Relevanz', () => {
    const dataForRelevance: Stelle[] = [
      // Let's create varying records to test priorities:
      // a: No program, no free accommodation, known location
      stelle({ id: 'a', land: 'Estland', programm: 'keins', kost_unterkunft_frei: false, titel: 'A_titel' }),
      // b: Program, free accommodation, known location
      stelle({ id: 'b', land: 'Griechenland', programm: 'ESC', kost_unterkunft_frei: true, titel: 'B_titel' }),
      // c: No program, free accommodation, known location
      stelle({ id: 'c', land: 'Thailand', programm: 'keins', kost_unterkunft_frei: true, titel: 'C_titel' }),
      // d: Program, free accommodation, unknown location ("Ort offen")
      stelle({ id: 'd', land: 'Ort offen', programm: 'ESC', kost_unterkunft_frei: true, titel: 'D_titel' }),
    ];
    const r = filterStellen(dataForRelevance, { ...DEFAULT_FILTER, ohneGebuehr: false, sort: 'relevanz' });
    // Expected order:
    // 1st: b (Program, free accommodation, known land)
    // 2nd: d (Program, free accommodation, unknown land "Ort offen" - program beats non-program)
    // 3rd: c (No program, free accommodation, known land)
    // 4th: a (No program, no free accommodation, known land)
    expect(r.map((s) => s.id)).toEqual(['b', 'd', 'c', 'a']);
  });

  it('suche normalisiert Umlaute und findet Synonyme', () => {
    const searchData: Stelle[] = [
      stelle({ id: '1', titel: 'Bären-Schutzprojekt', taetigkeitsfeld: ['Artenschutz/Tiere'] }),
      stelle({ id: '2', titel: 'Küstenforschung', taetigkeitsfeld: ['Meeresschutz'] }),
    ];
    // "baeren" normalisiert zu "baren" which should match "Bären" (which also normalizes to "baren")
    expect(filterStellen(searchData, { ...DEFAULT_FILTER, q: 'baeren' }).map((s) => s.id)).toEqual(['1']);
    // "Tiere" synonym matches "Artenschutz/Tiere"
    expect(filterStellen(searchData, { ...DEFAULT_FILTER, q: 'Tiere' }).map((s) => s.id)).toEqual(['1']);
    // "Meer" synonym matches "Meeresschutz"
    expect(filterStellen(searchData, { ...DEFAULT_FILTER, q: 'Meer' }).map((s) => s.id)).toEqual(['2']);
  });
});

describe('URL-Serialisierung', () => {
  it('leerer Default ergibt leere URL', () => {
    expect(filterToParams(DEFAULT_FILTER).toString()).toBe('');
  });

  it('round-trip erhält alle Werte', () => {
    const f: Filter = {
      q: 'wald',
      laender: ['Estland', 'Schweden'],
      felder: ['Naturschutz'],
      kontinente: ['Europa'],
      programme: ['ESC'],
      nurFrei: true,
      ohneGebuehr: false,
      dauerMax: 6,
      sort: 'frist',
    };
    const zurueck = parseFilter(new URLSearchParams(filterToParams(f).toString()));
    expect(zurueck).toEqual(f);
  });

  it('parst leere Parameter zum Default', () => {
    expect(parseFilter(new URLSearchParams(''))).toEqual(DEFAULT_FILTER);
  });
});
