import type { Programm } from '../types';

// Anzeige-Texte & Erklärungen (Tooltips) – durchgehend du-Ansprache, korrektes Deutsch.

export const PROGRAMM_LABEL: Record<Programm, string> = {
  ESC: 'EU-gefördert (ESC)',
  IJFD: 'Gefördert (IJFD)',
  weltwärts: 'Gefördert (weltwärts)',
  kulturweit: 'Gefördert (kulturweit)',
  keins: 'Ohne festes Förderprogramm',
};

export const PROGRAMM_TOOLTIP: Record<Programm, string> = {
  ESC:
    'European Solidarity Corps: Die EU übernimmt Reise, Unterkunft, Verpflegung, Versicherung ' +
    'und einen Sprachkurs und zahlt dir Taschengeld. Für dich kostenlos.',
  IJFD:
    'Internationaler Jugendfreiwilligendienst: staatlich gefördert, mit Unterkunft, Verpflegung ' +
    'und Taschengeld. Meist 6–18 Monate.',
  weltwärts:
    'Entwicklungspolitischer Freiwilligendienst (vor allem im Globalen Süden), gefördert vom BMZ ' +
    'inklusive Vorbereitung, Unterkunft, Verpflegung und Taschengeld.',
  kulturweit:
    'Freiwilligendienst in der auswärtigen Kultur- und Bildungspolitik, gefördert vom Auswärtigen Amt.',
  keins:
    'Kein festes Förderprogramm. Achte hier besonders darauf, welche Leistungen die Organisation ' +
    'selbst stellt – und ob eine Teilnahmegebühr anfällt.',
};

export const TAETIGKEITSFELDER = [
  'Naturschutz',
  'Artenschutz/Tiere',
  'Meeresschutz',
  'Forschung/Feldassistenz',
  'Landwirtschaft/Permakultur',
  'Wald/Forst',
  'Umweltbildung',
  'Klima/Nachhaltigkeit',
  'Sonstiges',
];

export const KONTINENTE = [
  'Europa',
  'Afrika',
  'Asien',
  'Nordamerika',
  'Südamerika',
  'Ozeanien',
  'Antarktis',
];

export const QUELLE_LABEL: Record<string, string> = {
  eurodesk: 'Eurodesk',
  'sci-workcamps': 'SCI Workcamps',
  'conservation-job-board': 'Conservation Job Board',
  'tamu-nr-jobs': 'Texas A&M Natural Resources Job Board',
  goodwork: 'GoodWork.ca',
  'conservation-careers': 'Conservation Careers',
  scb: 'Society for Conservation Biology',
  weltwaerts: 'weltwärts',
  foef: 'FÖF e.V.',
  nabu: 'NABU',
};

export function quelleLabel(quelle: string): string {
  return QUELLE_LABEL[quelle] ?? quelle;
}

export function dauerText(min: number | null, max: number | null): string {
  if (min == null && max == null) return 'Dauer flexibel';
  if (min != null && max != null) {
    if (min === max) return `${min} Monat${min === 1 ? '' : 'e'}`;
    return `${min}–${max} Monate`;
  }
  const wert = (min ?? max) as number;
  return `ab ${wert} Monat${wert === 1 ? '' : 'en'}`;
}

const MONATE = [
  'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
  'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
];

export function datumText(iso: string | null): string | null {
  if (!iso) return null;
  const [j, m, t] = iso.split('-').map(Number);
  if (!j || !m || !t) return iso;
  return `${t}. ${MONATE[m - 1]} ${j}`;
}
