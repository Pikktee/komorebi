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
