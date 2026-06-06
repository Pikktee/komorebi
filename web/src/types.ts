// Zielschema einer Stelle – identisch zu datenmodell.md / der Pipeline-Ausgabe.

export type Programm = 'ESC' | 'IJFD' | 'weltwärts' | 'kulturweit' | 'keins';

export interface Voraussetzungen {
  mindestalter: number | null;
  hoechstalter: number | null;
  sprache: string | null;
  vorkenntnisse: string | null;
}

export interface Stelle {
  id: string;
  titel: string;
  organisation: string;
  aufnahmeorganisation: string | null;
  entsendeorganisation: string | null;
  land: string;
  region: string | null;
  kontinent: string;
  dauer_monate_min: number | null;
  dauer_monate_max: number | null;
  zeitraum_von: string | null;
  zeitraum_bis: string | null;
  flexibler_start: boolean;
  taetigkeitsfeld: string[];
  beschreibung: string;
  bewerbungsfrist: string | null;
  voraussetzungen: Voraussetzungen;
  programm: Programm;
  kost_unterkunft_frei: boolean;
  kostenpflichtig: boolean;
  teilnahmegebuehr_eur: number | null;
  taschengeld_eur_monat: number | null;
  reisekosten_erstattet: boolean | null;
  versicherung: boolean | null;
  sprachkurs: boolean | null;
  quelle: string;
  quell_url: string;
  weitere_quell_urls: string[];
  quell_id: string | null;
  erstmals_gesehen: string;
  zuletzt_gesehen: string;
  zuletzt_geaendert: string;
}

export interface Datensatz {
  generiert_am: string;
  anzahl: number;
  stellen: Stelle[];
}
