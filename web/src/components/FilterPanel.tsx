import { Button, Group, MultiSelect, Select, Stack, Switch, Text, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import type { Filter, SortKey } from '../lib/filter';
import { DEFAULT_FILTER, istAktiv } from '../lib/filter';
import { KONTINENTE, PROGRAMM_LABEL, TAETIGKEITSFELDER } from '../lib/labels';
import { InfoTooltip } from './InfoTooltip';

const PROGRAMM_OPTIONS = (['ESC', 'IJFD', 'weltwärts', 'keins'] as const).map((p) => ({
  value: p,
  label: PROGRAMM_LABEL[p],
}));

const DAUER_OPTIONS = [
  { value: '', label: 'Egal wie lang' },
  { value: '1', label: 'Höchstens 1 Monat' },
  { value: '3', label: 'Höchstens 3 Monate' },
  { value: '6', label: 'Höchstens 6 Monate' },
  { value: '12', label: 'Höchstens 12 Monate' },
];

interface Props {
  filter: Filter;
  onChange: (f: Filter) => void;
  laenderOptions: string[];
}

export function FilterPanel({ filter, onChange, laenderOptions }: Props) {
  const set = (teil: Partial<Filter>) => onChange({ ...filter, ...teil });

  return (
    <Stack gap="md">
      <TextInput
        label="Suche"
        placeholder="z. B. Schildkröten, Wald, Schweden …"
        leftSection={<IconSearch size={16} />}
        value={filter.q}
        onChange={(e) => set({ q: e.currentTarget.value })}
        radius="md"
      />

      <MultiSelect
        label="Land"
        placeholder={filter.laender.length ? undefined : 'Alle Länder'}
        data={laenderOptions}
        value={filter.laender}
        onChange={(v) => set({ laender: v })}
        searchable
        clearable
        radius="md"
        nothingFoundMessage="Kein Land gefunden"
      />

      <MultiSelect
        label="Tätigkeitsfeld"
        placeholder={filter.felder.length ? undefined : 'Alle Bereiche'}
        data={TAETIGKEITSFELDER}
        value={filter.felder}
        onChange={(v) => set({ felder: v })}
        clearable
        radius="md"
      />

      <MultiSelect
        label="Kontinent"
        placeholder={filter.kontinente.length ? undefined : 'Weltweit'}
        data={KONTINENTE}
        value={filter.kontinente}
        onChange={(v) => set({ kontinente: v })}
        clearable
        radius="md"
      />

      <MultiSelect
        label="Förderung"
        placeholder={filter.programme.length ? undefined : 'Alle'}
        data={PROGRAMM_OPTIONS}
        value={filter.programme}
        onChange={(v) => set({ programme: v })}
        clearable
        radius="md"
      />

      <Select
        label="Dauer"
        data={DAUER_OPTIONS}
        value={filter.dauerMax == null ? '' : String(filter.dauerMax)}
        onChange={(v) => set({ dauerMax: v ? Number(v) : null })}
        allowDeselect={false}
        radius="md"
      />

      <Switch
        checked={filter.nurFrei}
        onChange={(e) => set({ nurFrei: e.currentTarget.checked })}
        color="wald"
        label="Nur mit freier Kost & Unterkunft"
      />

      <Group gap={6} wrap="nowrap">
        <Switch
          checked={filter.ohneGebuehr}
          onChange={(e) => set({ ohneGebuehr: e.currentTarget.checked })}
          color="wald"
          label="Kostenpflichtige ausblenden"
        />
        <InfoTooltip label="Manche Programme verlangen eine Teilnahmegebühr (Voluntourism). Standardmäßig blenden wir sie aus, damit du echte kostenlose Plätze siehst. Schalte den Regler aus, um auch bezahlte Programme zu sehen." />
      </Group>

      {istAktiv(filter) && (
        <Button
          variant="subtle"
          color="gray"
          leftSection={<IconX size={16} />}
          onClick={() => onChange({ ...DEFAULT_FILTER })}
        >
          Filter zurücksetzen
        </Button>
      )}

      <SortAuswahl value={filter.sort} onChange={(s) => set({ sort: s })} />
    </Stack>
  );
}

function SortAuswahl({ value, onChange }: { value: SortKey; onChange: (s: SortKey) => void }) {
  return (
    <div>
      <Text size="sm" fw={500} mb={4}>
        Sortierung
      </Text>
      <Select
        data={[
          { value: 'land', label: 'Land (A–Z)' },
          { value: 'frist', label: 'Bewerbungsfrist' },
          { value: 'dauer', label: 'Kürzeste Dauer zuerst' },
          { value: 'neu', label: 'Neu hinzugekommen' },
        ]}
        value={value}
        onChange={(v) => onChange((v as SortKey) ?? 'land')}
        allowDeselect={false}
        radius="md"
      />
    </div>
  );
}
