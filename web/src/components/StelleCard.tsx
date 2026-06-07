import type { CSSProperties } from 'react';
import { Badge, Box, Card, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconMapPin,
  IconClock,
  IconCalendarEvent,
  IconArrowUpRight,
  IconCalendarPlus,
  IconLeaf,
  IconBinoculars,
  IconRipple,
  IconSearch,
  IconPlant,
  IconTrees,
  IconSchool,
  IconWorld,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Stelle } from '../types';
import { LeistungsBadges } from './LeistungsBadges';
import { dauerText, datumText, PROGRAMM_LABEL } from '../lib/labels';
import { TaetigkeitsPills, feldFarbe } from './TaetigkeitsPills';
import { ProgramPopover } from './ProgramPopover';

function programmFarbe(stelle: Stelle): { color: string; variant: 'filled' | 'light' } {
  return stelle.programm === 'keins'
    ? { color: 'gray', variant: 'light' }
    : { color: 'himmel', variant: 'filled' };
}

function ortText(stelle: Stelle): string {
  if (stelle.land) return `${stelle.land}${stelle.region ? ` · ${stelle.region}` : ''}`;
  if (stelle.region) return stelle.region;
  return 'Ort offen';
}

function getWatermarkIcon(feld: string) {
  switch (feld) {
    case 'Naturschutz':
      return IconLeaf;
    case 'Artenschutz/Tiere':
      return IconBinoculars;
    case 'Meeresschutz':
      return IconRipple;
    case 'Forschung/Feldassistenz':
      return IconSearch;
    case 'Landwirtschaft/Permakultur':
      return IconPlant;
    case 'Wald/Forst':
      return IconTrees;
    case 'Umweltbildung':
      return IconSchool;
    case 'Klima/Nachhaltigkeit':
      return IconWorld;
    default:
      return IconLeaf;
  }
}

export function StelleCard({ stelle, showAddedDate = false }: { stelle: Stelle; showAddedDate?: boolean }) {
  const frist = datumText(stelle.bewerbungsfrist);
  const hinzugefuegt = datumText(stelle.erstmals_gesehen);
  const pf = programmFarbe(stelle);
  const akzent = feldFarbe(stelle.taetigkeitsfeld[0] ?? 'Sonstiges');
  const WatermarkIcon = getWatermarkIcon(stelle.taetigkeitsfeld[0] ?? 'Sonstiges');

  const style = {
    height: '100%',
    borderColor: 'var(--nz-line)',
    textDecoration: 'none',
    '--nz-accent': `var(--mantine-color-${akzent}-4)`,
  } as CSSProperties;

  return (
    <Card
      component={Link}
      to={`/stelle/${stelle.id}`}
      withBorder
      radius="md"
      padding="lg"
      className="nz-card"
      style={style}
    >
      <Box className="nz-card__glow" aria-hidden="true" />
      <Box className="nz-card__watermark" aria-hidden="true">
        <WatermarkIcon size={84} stroke={1.1} />
      </Box>
      
      <Stack gap="sm" h="100%" style={{ position: 'relative', zIndex: 1 }}>
        <Group justify="space-between" align="flex-start" wrap="nowrap" gap="xs">
          <Group gap={5} wrap="nowrap">
            <IconMapPin size={16} style={{ flexShrink: 0, color: 'var(--mantine-color-wald-6)' }} />
            <Text fw={700} size="sm" lineClamp={1} c="dark.4">
              {ortText(stelle)}
            </Text>
          </Group>
          <ProgramPopover programm={stelle.programm}>
            <Badge
              variant={pf.variant}
              color={pf.color}
              radius="sm"
              className="nz-badge-soft"
              style={{ textTransform: 'none', flexShrink: 0, cursor: 'pointer' }}
            >
              {PROGRAMM_LABEL[stelle.programm]}
            </Badge>
          </ProgramPopover>
        </Group>

        <Title order={3} fz="h4" lh={1.16} style={{ fontWeight: 650 }} lineClamp={2}>
          {stelle.titel}
        </Title>
        <Text size="sm" c="dimmed" mt={-4} lineClamp={1}>
          {stelle.organisation}
        </Text>

        <TaetigkeitsPills felder={stelle.taetigkeitsfeld} max={3} />

        {stelle.beschreibung && (
          <Text size="sm" c="dark.4" lineClamp={2} style={{ lineHeight: 1.4 }}>
            {stelle.beschreibung}
          </Text>
        )}

        <Group justify="space-between" align="flex-end" gap="md" mt="auto" pt={6}>
          <Stack gap={6}>
            <Group gap={5} c="dark.3">
              <IconClock size={15} style={{ flexShrink: 0 }} />
              <Text size="xs">{dauerText(stelle.dauer_monate_min, stelle.dauer_monate_max)}</Text>
            </Group>
            {frist && (
              <Group gap={5} c="dark.3">
                <IconCalendarEvent size={15} style={{ flexShrink: 0 }} />
                <Text size="xs">Bewerbung bis {frist}</Text>
              </Group>
            )}
            {showAddedDate && hinzugefuegt && (
              <Group gap={5} c="dark.3">
                <IconCalendarPlus size={15} style={{ flexShrink: 0 }} />
                <Text size="xs">Hinzugefügt am {hinzugefuegt}</Text>
              </Group>
            )}
          </Stack>
          <Box className="nz-card__arrow" aria-hidden="true">
            <IconArrowUpRight size={18} />
          </Box>
        </Group>

        <LeistungsBadges stelle={stelle} />
      </Stack>
    </Card>
  );
}
