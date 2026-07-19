import { Badge, Group } from '@mantine/core';
import { IconX } from '@tabler/icons-react';
import type { Filter, FristFilter } from '../lib/filter';
import { PROGRAMM_LABEL } from '../lib/labels';

// Kurztexte für die Bewerbungsschluss-Chips (ohne 'egal', das keinen Chip erzeugt).
const FRIST_CHIP: Record<Exclude<FristFilter, 'egal'>, string> = {
  '2w': 'Frist: noch ≥ 2 Wochen',
  '1m': 'Frist: noch ≥ 1 Monat',
  '2m': 'Frist: noch ≥ 2 Monate',
  unbegrenzt: 'Nur unbegrenzt offene',
};

interface Props {
  filter: Filter;
  onChange: (f: Filter) => void;
}

/**
 * Leiste der aktiven Filter als entfernbare Chips. Gemeinsam von Listen- und
 * Kartenansicht genutzt, damit beide dieselben Filter identisch anzeigen.
 * Die Sichtbarkeit steuert die aufrufende Seite (nur zeigen, wenn Filter aktiv sind).
 */
export function AktiveFilterChips({ filter, onChange }: Props) {
  const set = (teil: Partial<Filter>) => onChange({ ...filter, ...teil });
  const laenderPraefix = filter.laenderModus === 'ausser' ? 'Außer: ' : '';
  const kontinentPraefix = filter.kontinenteModus === 'ausser' ? 'Außer: ' : '';

  return (
    <Group gap="xs" mb="lg" wrap="wrap">
      {filter.q.trim() && <Chip label={`Suche: ${filter.q}`} onRemove={() => set({ q: '' })} />}
      {filter.laender.map((l) => (
        <Chip
          key={l}
          label={`${laenderPraefix}${l}`}
          onRemove={() => set({ laender: filter.laender.filter((x) => x !== l) })}
        />
      ))}
      {filter.felder.map((f) => (
        <Chip
          key={f}
          label={`Bereich: ${f}`}
          onRemove={() => set({ felder: filter.felder.filter((x) => x !== f) })}
        />
      ))}
      {filter.kontinente.map((k) => (
        <Chip
          key={k}
          label={`${kontinentPraefix}${k}`}
          onRemove={() => set({ kontinente: filter.kontinente.filter((x) => x !== k) })}
        />
      ))}
      {filter.programme.map((p) => (
        <Chip
          key={p}
          label={PROGRAMM_LABEL[p as keyof typeof PROGRAMM_LABEL] || p}
          onRemove={() => set({ programme: filter.programme.filter((x) => x !== p) })}
        />
      ))}
      {filter.dauerMax != null && (
        <Chip label={`Dauer: ≤ ${filter.dauerMax} Mon.`} onRemove={() => set({ dauerMax: null })} />
      )}
      {filter.frist !== 'egal' && (
        <Chip label={FRIST_CHIP[filter.frist]} onRemove={() => set({ frist: 'egal' })} />
      )}
      {filter.nurFrei && (
        <Chip label="Kost & Unterkunft frei" onRemove={() => set({ nurFrei: false })} />
      )}
      {!filter.ohneGebuehr && (
        <Chip label="Mit Gebühren" onRemove={() => set({ ohneGebuehr: true })} />
      )}
    </Group>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge
      variant="light"
      color="wald"
      size="sm"
      pr={3}
      rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={onRemove} />}
    >
      {label}
    </Badge>
  );
}
