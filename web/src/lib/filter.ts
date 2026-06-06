import type { Stelle } from '../types';

export type SortKey = 'land' | 'frist' | 'dauer' | 'neu';

export interface Filter {
  q: string;
  laender: string[];
  felder: string[];
  kontinente: string[];
  programme: string[];
  nurFrei: boolean; // nur Stellen mit freier Kost & Unterkunft
  ohneGebuehr: boolean; // kostenpflichtige Programme ausblenden
  dauerMax: number | null; // höchstens so viele Monate Mindestdauer
  sort: SortKey;
}

export const DEFAULT_FILTER: Filter = {
  q: '',
  laender: [],
  felder: [],
  kontinente: [],
  programme: [],
  nurFrei: false,
  ohneGebuehr: true, // Default laut Konzept: Voluntourism-Gebühren ausgeblendet
  dauerMax: null,
  sort: 'land',
};

function enthaelt(text: string | null | undefined, suche: string): boolean {
  return (text ?? '').toLowerCase().includes(suche);
}

function schnittmenge(a: string[], b: string[]): boolean {
  return a.some((x) => b.includes(x));
}

/** Wendet alle aktiven Filter an und sortiert das Ergebnis. */
export function filterStellen(stellen: Stelle[], f: Filter): Stelle[] {
  const suche = f.q.trim().toLowerCase();

  const gefiltert = stellen.filter((s) => {
    if (suche) {
      const treffer =
        enthaelt(s.titel, suche) ||
        enthaelt(s.organisation, suche) ||
        enthaelt(s.beschreibung, suche) ||
        enthaelt(s.land, suche) ||
        enthaelt(s.region, suche) ||
        s.taetigkeitsfeld.some((t) => enthaelt(t, suche));
      if (!treffer) return false;
    }
    if (f.laender.length && !f.laender.includes(s.land)) return false;
    if (f.kontinente.length && !f.kontinente.includes(s.kontinent)) return false;
    if (f.programme.length && !f.programme.includes(s.programm)) return false;
    if (f.felder.length && !schnittmenge(f.felder, s.taetigkeitsfeld)) return false;
    if (f.nurFrei && !s.kost_unterkunft_frei) return false;
    if (f.ohneGebuehr && s.kostenpflichtig) return false;
    if (f.dauerMax != null) {
      const min = s.dauer_monate_min;
      if (min != null && min > f.dauerMax) return false;
    }
    return true;
  });

  return sortiere(gefiltert, f.sort);
}

function sortiere(stellen: Stelle[], sort: SortKey): Stelle[] {
  const kopie = [...stellen];
  switch (sort) {
    case 'frist':
      return kopie.sort(
        (a, b) => (a.bewerbungsfrist ?? '9999').localeCompare(b.bewerbungsfrist ?? '9999'),
      );
    case 'dauer':
      return kopie.sort(
        (a, b) => (a.dauer_monate_min ?? 999) - (b.dauer_monate_min ?? 999),
      );
    case 'neu':
      return kopie.sort((a, b) => b.erstmals_gesehen.localeCompare(a.erstmals_gesehen));
    case 'land':
    default:
      return kopie.sort(
        (a, b) => a.land.localeCompare(b.land, 'de') || a.titel.localeCompare(b.titel, 'de'),
      );
  }
}

// ---- URL-Serialisierung (deeplinkbar + Browser-Historie) ----

export function parseFilter(params: URLSearchParams): Filter {
  const liste = (key: string): string[] => {
    const v = params.get(key);
    return v ? v.split(',').filter(Boolean) : [];
  };
  const dauerRaw = params.get('dauer');
  const dauerMax = dauerRaw != null && dauerRaw !== '' ? Number(dauerRaw) : null;
  const sort = (params.get('sort') as SortKey) || 'land';
  return {
    q: params.get('q') ?? '',
    laender: liste('land'),
    felder: liste('feld'),
    kontinente: liste('kontinent'),
    programme: liste('programm'),
    nurFrei: params.get('frei') === '1',
    ohneGebuehr: params.get('mitGebuehr') !== '1',
    dauerMax: Number.isFinite(dauerMax as number) ? dauerMax : null,
    sort: (['land', 'frist', 'dauer', 'neu'] as SortKey[]).includes(sort) ? sort : 'land',
  };
}

/** Nur abweichende Werte landen in der URL, damit sie kurz und lesbar bleibt. */
export function filterToParams(f: Filter): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.laender.length) p.set('land', f.laender.join(','));
  if (f.felder.length) p.set('feld', f.felder.join(','));
  if (f.kontinente.length) p.set('kontinent', f.kontinente.join(','));
  if (f.programme.length) p.set('programm', f.programme.join(','));
  if (f.nurFrei) p.set('frei', '1');
  if (!f.ohneGebuehr) p.set('mitGebuehr', '1');
  if (f.dauerMax != null) p.set('dauer', String(f.dauerMax));
  if (f.sort !== 'land') p.set('sort', f.sort);
  return p;
}

export function istAktiv(f: Filter): boolean {
  return (
    f.q.trim() !== '' ||
    f.laender.length > 0 ||
    f.felder.length > 0 ||
    f.kontinente.length > 0 ||
    f.programme.length > 0 ||
    f.nurFrei ||
    !f.ohneGebuehr ||
    f.dauerMax != null
  );
}

export function anzahlAktiverFilter(f: Filter): number {
  let n = 0;
  if (f.q.trim()) n += 1;
  n += f.laender.length ? 1 : 0;
  n += f.felder.length ? 1 : 0;
  n += f.kontinente.length ? 1 : 0;
  n += f.programme.length ? 1 : 0;
  if (f.nurFrei) n += 1;
  if (!f.ohneGebuehr) n += 1;
  if (f.dauerMax != null) n += 1;
  return n;
}
