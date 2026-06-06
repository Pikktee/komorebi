import { Group, Pill } from '@mantine/core';

const FELD_FARBE: Record<string, string> = {
  Naturschutz: 'wald',
  'Artenschutz/Tiere': 'terra',
  Meeresschutz: 'cyan',
  'Forschung/Feldassistenz': 'grape',
  'Landwirtschaft/Permakultur': 'lime',
  'Wald/Forst': 'teal',
  Umweltbildung: 'blue',
  'Klima/Nachhaltigkeit': 'orange',
  Sonstiges: 'gray',
};

export function feldFarbe(feld: string): string {
  return FELD_FARBE[feld] ?? 'gray';
}

export function TaetigkeitsPills({ felder, max }: { felder: string[]; max?: number }) {
  const sichtbar = max ? felder.slice(0, max) : felder;
  const rest = max ? felder.length - sichtbar.length : 0;
  return (
    <Group gap={6}>
      {sichtbar.map((f) => (
        <Pill
          key={f}
          size="sm"
          style={{
            backgroundColor: `var(--mantine-color-${feldFarbe(f)}-1)`,
            color: `var(--mantine-color-${feldFarbe(f)}-9)`,
            fontWeight: 600,
          }}
        >
          {f}
        </Pill>
      ))}
      {rest > 0 && (
        <Pill size="sm" c="dimmed">
          +{rest}
        </Pill>
      )}
    </Group>
  );
}
