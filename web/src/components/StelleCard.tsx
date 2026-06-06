import type { CSSProperties } from 'react';
import { Badge, Card, Group, Stack, Text, Title } from '@mantine/core';
import { IconMapPin, IconClock, IconCalendarEvent } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Stelle } from '../types';
import { LeistungsBadges } from './LeistungsBadges';
import { dauerText, datumText, PROGRAMM_LABEL } from '../lib/labels';
import { TaetigkeitsPills, feldFarbe } from './TaetigkeitsPills';

function programmFarbe(stelle: Stelle): { color: string; variant: 'filled' | 'light' } {
  return stelle.programm === 'keins'
    ? { color: 'gray', variant: 'light' }
    : { color: 'wald', variant: 'filled' };
}

export function StelleCard({ stelle }: { stelle: Stelle }) {
  const frist = datumText(stelle.bewerbungsfrist);
  const pf = programmFarbe(stelle);
  const akzent = feldFarbe(stelle.taetigkeitsfeld[0] ?? 'Sonstiges');

  const style = {
    height: '100%',
    borderColor: 'var(--nz-line)',
    textDecoration: 'none',
    '--nz-accent': `var(--mantine-color-${akzent}-5)`,
  } as CSSProperties;

  return (
    <Card
      component={Link}
      to={`/stelle/${stelle.id}`}
      withBorder
      radius="lg"
      padding="lg"
      pt="xl"
      className="nz-card nz-accent"
      style={style}
    >
      <Stack gap="sm" h="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
          <Group gap={5} c="wald.8" wrap="nowrap">
            <IconMapPin size={16} />
            <Text fw={600} size="sm" lineClamp={1}>
              {stelle.land || 'Ortsunabhängig'}
              {stelle.region ? (
                <Text span c="dimmed" fw={400}>
                  {' '}
                  · {stelle.region}
                </Text>
              ) : null}
            </Text>
          </Group>
          <Badge variant={pf.variant} color={pf.color} radius="sm" style={{ textTransform: 'none', flexShrink: 0 }}>
            {PROGRAMM_LABEL[stelle.programm]}
          </Badge>
        </Group>

        <Title order={3} fz="h4" lh={1.15} style={{ fontWeight: 600 }} lineClamp={2}>
          {stelle.titel}
        </Title>
        <Text size="sm" c="dimmed" mt={-6} lineClamp={1}>
          {stelle.organisation}
        </Text>

        <TaetigkeitsPills felder={stelle.taetigkeitsfeld} max={3} />

        {stelle.beschreibung && (
          <Text size="sm" c="dark.4" lineClamp={2}>
            {stelle.beschreibung}
          </Text>
        )}

        <Group gap="lg" mt="auto" pt={4}>
          <Group gap={5} c="dark.3">
            <IconClock size={15} />
            <Text size="xs">{dauerText(stelle.dauer_monate_min, stelle.dauer_monate_max)}</Text>
          </Group>
          {frist && (
            <Group gap={5} c="dark.3">
              <IconCalendarEvent size={15} />
              <Text size="xs">Bewerbung bis {frist}</Text>
            </Group>
          )}
        </Group>

        <LeistungsBadges stelle={stelle} />
      </Stack>
    </Card>
  );
}
