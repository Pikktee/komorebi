import type { Stelle } from '../types';

export type SortKey = 'land' | 'frist' | 'dauer' | 'neu' | 'relevanz';

/** Ob die Land-/Kontinent-Auswahl ein- oder ausschließt. */
export type FilterModus = 'nur' | 'ausser';

/**
 * Bewerbungsschluss-Vorlauf. `2w`/`1m`/`2m` = Frist liegt mindestens so weit in der
 * Zukunft; fristlose Stellen bleiben dabei sichtbar. `unbegrenzt` = nur fristlose.
 */
export type FristFilter = 'egal' | '2w' | '1m' | '2m' | 'unbegrenzt';

export interface Filter {
  q: string;
  laender: string[];
  laenderModus: FilterModus; // 'nur' = einschließen, 'ausser' = ausschließen
  felder: string[];
  kontinente: string[];
  kontinenteModus: FilterModus;
  programme: string[];
  nurFrei: boolean; // nur Stellen mit freier Kost & Unterkunft
  ohneGebuehr: boolean; // kostenpflichtige Programme ausblenden
  dauerMax: number | null; // höchstens so viele Monate Mindestdauer
  frist: FristFilter; // Bewerbungsschluss-Vorlauf
  sort: SortKey;
}

export const DEFAULT_FILTER: Filter = {
  q: '',
  laender: [],
  laenderModus: 'nur',
  felder: [],
  kontinente: [],
  kontinenteModus: 'nur',
  programme: [],
  nurFrei: false,
  ohneGebuehr: true, // Default laut Konzept: Voluntourism-Gebühren ausgeblendet
  dauerMax: null,
  frist: 'egal',
  sort: 'relevanz',
};

const SYNONYMS: Record<string, string[]> = {
  tiere: ['artenschutz/tiere', 'tier', 'zoologie', 'wildlife'],
  tier: ['artenschutz/tiere', 'tiere', 'zoologie', 'wildlife'],
  meer: ['meeresschutz', 'ozean', 'marine', 'sea', 'ocean'],
  meere: ['meeresschutz', 'ozean', 'marine', 'sea', 'ocean'],
  wasser: ['meeresschutz', 'gewasser', 'river', 'marine'],
  vogel: ['ornithologie', 'vogelschutz', 'bird'],
  wald: ['forst', 'baum', 'baume', 'forest', 'tree'],
  pflanzen: ['permakultur', 'landwirtschaft', 'botanik', 'plant'],
  klima: ['nachhaltigkeit', 'umweltschutz', 'climate'],
};

function cleanString(str: string | null | undefined): string {
  return (str ?? '')
    .toLowerCase()
    .replace(/ae/g, 'a')
    .replace(/oe/g, 'o')
    .replace(/ue/g, 'u')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ß/g, 'ss');
}

function enthaelt(text: string | null | undefined, sucheCleaned: string): boolean {
  return cleanString(text).includes(sucheCleaned);
}

/** Lokales Datum als YYYY-MM-DD (für lexikografischen Vergleich mit ISO-Fristen). */
function isoDatum(d: Date): string {
  const j = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const t = String(d.getDate()).padStart(2, '0');
  return `${j}-${m}-${t}`;
}

/**
 * Früheste noch akzeptierte Bewerbungsfrist für eine Vorlauf-Kategorie – oder `null`,
 * wenn keine Schwelle gilt (`egal`/`unbegrenzt`). Rechnet ab Mitternacht (heute), damit
 * die Tageszeit das Ergebnis nicht verschiebt. Monatsüberläufe (31. + 1 Monat) rollen
 * wie in JS üblich in den Folgemonat – für die grobe Vorlauf-Schwelle unerheblich.
 */
export function fristSchwelleIso(heute: Date, frist: FristFilter): string | null {
  const d = new Date(heute.getFullYear(), heute.getMonth(), heute.getDate());
  switch (frist) {
    case '2w':
      d.setDate(d.getDate() + 14);
      return isoDatum(d);
    case '1m':
      d.setMonth(d.getMonth() + 1);
      return isoDatum(d);
    case '2m':
      d.setMonth(d.getMonth() + 2);
      return isoDatum(d);
    default:
      return null;
  }
}

/** Wendet alle aktiven Filter an und sortiert das Ergebnis. */
export function filterStellen(stellen: Stelle[], f: Filter, heute: Date = new Date()): Stelle[] {
  const suche = f.q.trim();
  const fristSchwelle = fristSchwelleIso(heute, f.frist);

  const gefiltert = stellen.filter((s) => {
    if (suche) {
      const cleanedSuche = cleanString(suche);
      const searchTerms = [cleanedSuche];
      for (const [key, synList] of Object.entries(SYNONYMS)) {
        if (cleanedSuche.includes(key) || key.includes(cleanedSuche)) {
          synList.forEach((syn) => {
            const cs = cleanString(syn);
            if (!searchTerms.includes(cs)) {
              searchTerms.push(cs);
            }
          });
        }
      }

      const treffer = searchTerms.some((term) =>
        enthaelt(s.titel, term) ||
        enthaelt(s.organisation, term) ||
        enthaelt(s.beschreibung, term) ||
        enthaelt(s.land, term) ||
        enthaelt(s.region, term) ||
        s.taetigkeitsfeld.some((t) => enthaelt(t, term))
      );
      if (!treffer) return false;
    }
    if (f.laender.length) {
      const drin = f.laender.includes(s.land);
      if (f.laenderModus === 'ausser' ? drin : !drin) return false;
    }
    if (f.kontinente.length) {
      const drin = f.kontinente.includes(s.kontinent);
      if (f.kontinenteModus === 'ausser' ? drin : !drin) return false;
    }
    if (f.programme.length && !f.programme.includes(s.programm)) return false;
    if (f.felder.length && !schnittmenge(f.felder, s.taetigkeitsfeld)) return false;
    if (f.nurFrei && !s.kost_unterkunft_frei) return false;
    if (f.ohneGebuehr && s.kostenpflichtig) return false;
    if (f.dauerMax != null) {
      const min = s.dauer_monate_min;
      if (min != null && min > f.dauerMax) return false;
    }
    if (f.frist === 'unbegrenzt') {
      // Nur laufend offene Stellen (kein fester Schluss).
      if (s.bewerbungsfrist != null) return false;
    } else if (fristSchwelle) {
      // Fristlose Stellen bleiben sichtbar; datierte nur mit genug Vorlauf.
      if (s.bewerbungsfrist != null && s.bewerbungsfrist < fristSchwelle) return false;
    }
    return true;
  });

  return sortiere(gefiltert, f.sort);
}

function schnittmenge(a: string[], b: string[]): boolean {
  return a.some((x) => b.includes(x));
}

function compareRelevanz(a: Stelle, b: Stelle): number {
  // 1. Gefördertes Programm
  const aGov = a.programm !== 'keins' ? 1 : 0;
  const bGov = b.programm !== 'keins' ? 1 : 0;
  if (aGov !== bGov) return bGov - aGov;

  // 2. Freie Kost & Unterkunft
  const aFrei = a.kost_unterkunft_frei ? 1 : 0;
  const bFrei = b.kost_unterkunft_frei ? 1 : 0;
  if (aFrei !== bFrei) return bFrei - aFrei;

  // 3. Bekannter Ort (Leere Länder / Ort offen nach hinten)
  const aLand = a.land && a.land.trim() !== '' && a.land !== 'Ort offen' && a.land !== 'Weltweit' ? 1 : 0;
  const bLand = b.land && b.land.trim() !== '' && b.land !== 'Ort offen' && b.land !== 'Weltweit' ? 1 : 0;
  if (aLand !== bLand) return bLand - aLand;

  // 4. Bewerbungsfrist (Earliest first, null/empty to the end)
  const aFrist = a.bewerbungsfrist || '9999-12-31';
  const bFrist = b.bewerbungsfrist || '9999-12-31';
  if (aFrist !== bFrist) return aFrist.localeCompare(bFrist);

  // 5. Titel
  return a.titel.localeCompare(b.titel, 'de');
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
      return kopie.sort(
        (a, b) => a.land.localeCompare(b.land, 'de') || a.titel.localeCompare(b.titel, 'de'),
      );
    case 'relevanz':
    default:
      return kopie.sort(compareRelevanz);
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
  const sort = (params.get('sort') as SortKey) || 'relevanz';
  const modus = (key: string): FilterModus => (params.get(key) === 'ausser' ? 'ausser' : 'nur');
  const fristRaw = params.get('frist') as FristFilter;
  const frist: FristFilter = (['2w', '1m', '2m', 'unbegrenzt'] as FristFilter[]).includes(fristRaw) ? fristRaw : 'egal';
  return {
    q: params.get('q') ?? '',
    laender: liste('land'),
    laenderModus: modus('landModus'),
    felder: liste('feld'),
    kontinente: liste('kontinent'),
    kontinenteModus: modus('kontinentModus'),
    programme: liste('programm'),
    nurFrei: params.get('frei') === '1',
    ohneGebuehr: params.get('mitGebuehr') !== '1',
    dauerMax: Number.isFinite(dauerMax as number) ? dauerMax : null,
    frist,
    sort: (['land', 'frist', 'dauer', 'neu', 'relevanz'] as SortKey[]).includes(sort) ? sort : 'relevanz',
  };
}

/** Nur abweichende Werte landen in der URL, damit sie kurz und lesbar bleibt. */
export function filterToParams(f: Filter): URLSearchParams {
  const p = new URLSearchParams();
  if (f.q.trim()) p.set('q', f.q.trim());
  if (f.laender.length) p.set('land', f.laender.join(','));
  if (f.laenderModus === 'ausser') p.set('landModus', 'ausser');
  if (f.felder.length) p.set('feld', f.felder.join(','));
  if (f.kontinente.length) p.set('kontinent', f.kontinente.join(','));
  if (f.kontinenteModus === 'ausser') p.set('kontinentModus', 'ausser');
  if (f.programme.length) p.set('programm', f.programme.join(','));
  if (f.nurFrei) p.set('frei', '1');
  if (!f.ohneGebuehr) p.set('mitGebuehr', '1');
  if (f.dauerMax != null) p.set('dauer', String(f.dauerMax));
  if (f.frist !== 'egal') p.set('frist', f.frist);
  if (f.sort !== 'relevanz') p.set('sort', f.sort);
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
    f.dauerMax != null ||
    f.frist !== 'egal'
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
  if (f.frist !== 'egal') n += 1;
  return n;
}
