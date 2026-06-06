import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';
import { StelleCard } from './StelleCard';
import { theme } from '../theme';
import type { Stelle } from '../types';

const beispiel: Stelle = {
  id: 'demo-1',
  titel: 'Sea Turtle Conservation Workcamp',
  organisation: 'ARCHELON',
  aufnahmeorganisation: null,
  entsendeorganisation: null,
  land: 'Griechenland',
  region: 'Peloponnes',
  kontinent: 'Europa',
  dauer_monate_min: 1,
  dauer_monate_max: 3,
  zeitraum_von: '2026-06-15',
  zeitraum_bis: '2026-09-30',
  flexibler_start: true,
  taetigkeitsfeld: ['Meeresschutz', 'Artenschutz/Tiere'],
  beschreibung: 'Schutz von Schildkrötennestern und Monitoring.',
  bewerbungsfrist: '2026-05-31',
  voraussetzungen: { mindestalter: 18, hoechstalter: null, sprache: 'Englisch', vorkenntnisse: null },
  programm: 'keins',
  kost_unterkunft_frei: true,
  kostenpflichtig: false,
  teilnahmegebuehr_eur: null,
  taschengeld_eur_monat: null,
  reisekosten_erstattet: null,
  versicherung: null,
  sprachkurs: null,
  quelle: 'sci-workcamps',
  quell_url: 'https://example.org/x',
  weitere_quell_urls: [],
  quell_id: 'x',
  erstmals_gesehen: '2026-06-05',
  zuletzt_gesehen: '2026-06-05',
  zuletzt_geaendert: '2026-06-05',
};

function renderCard() {
  return render(
    <MantineProvider theme={theme}>
      <MemoryRouter>
        <StelleCard stelle={beispiel} />
      </MemoryRouter>
    </MantineProvider>,
  );
}

describe('StelleCard', () => {
  it('zeigt Titel, Organisation und Land', () => {
    renderCard();
    expect(screen.getByText('Sea Turtle Conservation Workcamp')).toBeInTheDocument();
    expect(screen.getByText('ARCHELON')).toBeInTheDocument();
    expect(screen.getByText(/Griechenland/)).toBeInTheDocument();
  });

  it('verlinkt auf die Detailseite', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/stelle/demo-1');
  });

  it('zeigt die Leistung „Kost & Unterkunft frei“', () => {
    renderCard();
    expect(screen.getByText('Kost & Unterkunft frei')).toBeInTheDocument();
  });

  it('zeigt optional das Hinzufügedatum', () => {
    render(
      <MantineProvider theme={theme}>
        <MemoryRouter>
          <StelleCard stelle={beispiel} showAddedDate />
        </MemoryRouter>
      </MantineProvider>,
    );
    expect(screen.getByText('Hinzugefügt am 5. Juni 2026')).toBeInTheDocument();
  });
});
