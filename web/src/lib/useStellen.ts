import { useEffect, useState } from 'react';
import type { Datensatz, Stelle, Metriken } from '../types';

export interface StellenState {
  stellen: Stelle[];
  generiertAm: string | null;
  metriken: Metriken | null;
  loading: boolean;
  error: string | null;
}

/** Lädt den täglich generierten Datensatz (public/datensatz.json). */
export function useStellen(): StellenState {
  const [state, setState] = useState<StellenState>({
    stellen: [],
    generiertAm: null,
    metriken: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let abgebrochen = false;
    fetch(`${import.meta.env.BASE_URL}datensatz.json`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d: Datensatz) => {
        if (abgebrochen) return;
        setState({
          stellen: d.stellen ?? [],
          generiertAm: d.generiert_am ?? null,
          metriken: d.metriken ?? null,
          loading: false,
          error: null,
        });
      })
      .catch((e: unknown) => {
        if (abgebrochen) return;
        setState({
          stellen: [],
          generiertAm: null,
          metriken: null,
          loading: false,
          error: e instanceof Error ? e.message : 'Unbekannter Fehler',
        });
      });
    return () => {
      abgebrochen = true;
    };
  }, []);

  return state;
}
