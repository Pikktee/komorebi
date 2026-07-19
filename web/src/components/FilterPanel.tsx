import { Button, Group, MultiSelect, SegmentedControl, Select, Stack, Switch, Text, TextInput } from '@mantine/core';
import { IconSearch, IconX } from '@tabler/icons-react';
import type { Filter, FilterModus, FristFilter, SortKey } from '../lib/filter';
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

const FRIST_OPTIONS: { value: FristFilter; label: string }[] = [
  { value: 'egal', label: 'Egal' },
  { value: '2w', label: 'Noch mind. 2 Wochen offen' },
  { value: '1m', label: 'Noch mind. 1 Monat offen' },
  { value: '2m', label: 'Noch mind. 2 Monate offen' },
  { value: 'unbegrenzt', label: 'Nur unbegrenzt offene' },
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
        label={<FilterLabel text="Suche" tip="Durchsucht Titel, Organisation, Land, Tätigkeitsfelder und Beschreibung." />}
        placeholder="z. B. Schildkröten, Wald, Schweden …"
        leftSection={<IconSearch size={16} />}
        value={filter.q}
        onChange={(e) => set({ q: e.currentTarget.value })}
        radius="md"
      />

      <div>
        <FilterLabel text="Land" tip="Nur Länder aus dem aktuellen Datensatz werden angezeigt." mb={6} />
        {filter.laender.length > 0 && (
          <ModusUmschalter value={filter.laenderModus} onChange={(m) => set({ laenderModus: m })} />
        )}
        <MultiSelect
          placeholder={filter.laender.length ? undefined : 'Alle Länder'}
          data={laenderOptions}
          value={filter.laender}
          onChange={(v) => set({ laender: v })}
          searchable
          clearable
          radius="md"
          nothingFoundMessage="Kein Land gefunden"
        />
      </div>

      <MultiSelect
        label={<FilterLabel text="Tätigkeitsfeld" tip="Die Felder werden aus Quelle, Text und LLM-Prüfung abgeleitet." />}
        placeholder={filter.felder.length ? undefined : 'Alle Bereiche'}
        data={TAETIGKEITSFELDER}
        value={filter.felder}
        onChange={(v) => set({ felder: v })}
        clearable
        radius="md"
      />

      <div>
        <FilterLabel text="Kontinent" tip="Praktisch, wenn du erst einmal nach Weltregion suchen möchtest." mb={6} />
        {filter.kontinente.length > 0 && (
          <ModusUmschalter value={filter.kontinenteModus} onChange={(m) => set({ kontinenteModus: m })} />
        )}
        <MultiSelect
          placeholder={filter.kontinente.length ? undefined : 'Weltweit'}
          data={KONTINENTE}
          value={filter.kontinente}
          onChange={(v) => set({ kontinente: v })}
          clearable
          radius="md"
        />
      </div>

      <MultiSelect
        label={<FilterLabel text="Förderung" tip="Geförderte Programme übernehmen meist mehr Leistungen, dauern aber oft länger." />}
        placeholder={filter.programme.length ? undefined : 'Alle'}
        data={PROGRAMM_OPTIONS}
        value={filter.programme}
        onChange={(v) => set({ programme: v })}
        clearable
        radius="md"
      />

      <Select
        label={<FilterLabel text="Dauer" tip="Filtert nach der maximal angegebenen Dauer. Flexible Stellen bleiben sichtbar." />}
        data={DAUER_OPTIONS}
        value={filter.dauerMax == null ? '' : String(filter.dauerMax)}
        onChange={(v) => set({ dauerMax: v ? Number(v) : null })}
        allowDeselect={false}
        radius="md"
      />

      <Select
        label={<FilterLabel text="Bewerbungsschluss" tip="Zeigt nur Stellen mit genug Vorlauf bis zum Bewerbungsschluss. Stellen ohne festen Schluss (laufend offen) bleiben bei allen Vorlauf-Stufen sichtbar." />}
        data={FRIST_OPTIONS}
        value={filter.frist}
        onChange={(v) => set({ frist: (v as FristFilter) ?? 'egal' })}
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
      <FilterLabel text="Sortierung" tip="Die Sortierung verändert nur die Reihenfolge, nicht deine Filter." mb={4} />
      <Select
        data={[
          { value: 'relevanz', label: 'Beste Relevanz' },
          { value: 'land', label: 'Land (A–Z)' },
          { value: 'frist', label: 'Bewerbungsfrist' },
          { value: 'dauer', label: 'Kürzeste Dauer zuerst' },
          { value: 'neu', label: 'Neu hinzugekommen' },
        ]}
        value={value}
        onChange={(v) => onChange((v as SortKey) ?? 'relevanz')}
        allowDeselect={false}
        radius="md"
      />
    </div>
  );
}

function ModusUmschalter({ value, onChange }: { value: FilterModus; onChange: (m: FilterModus) => void }) {
  return (
    <SegmentedControl
      fullWidth
      size="xs"
      color="wald"
      value={value}
      onChange={(v) => onChange(v as FilterModus)}
      data={[
        { value: 'nur', label: 'Nur diese' },
        { value: 'ausser', label: 'Außer diese' },
      ]}
      mb={8}
    />
  );
}

function FilterLabel({ text, tip, mb }: { text: string; tip: string; mb?: number }) {
  return (
    <Group gap={4} wrap="nowrap" mb={mb}>
      <Text size="sm" fw={500}>
        {text}
      </Text>
      <InfoTooltip label={tip} />
    </Group>
  );
}
