import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  List,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCalendar,
  IconClock,
  IconMapPin,
  IconExternalLink,
} from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import { dauerText, datumText, PROGRAMM_LABEL, PROGRAMM_TOOLTIP, quelleLabel } from '../lib/labels';
import { TaetigkeitsPills, feldFarbe } from '../components/TaetigkeitsPills';
import { LeistungsBadges } from '../components/LeistungsBadges';
import { InfoTooltip } from '../components/InfoTooltip';
import type { CSSProperties } from 'react';

function FactRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <Box c="wald.7" mt={2}>
        {icon}
      </Box>
      <div>
        <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
          {label}
        </Text>
        <Text fw={500}>{value}</Text>
      </div>
    </Group>
  );
}

export function DetailPage() {
  const { id } = useParams();
  const { stellen, loading } = useStellen();
  const stelle = stellen.find((s) => s.id === id);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Text c="dimmed">Lade …</Text>
      </Container>
    );
  }

  if (!stelle) {
    return (
      <Container size="md" py={80}>
        <Stack align="center" gap="md">
          <Title order={2}>Stelle nicht gefunden</Title>
          <Text c="dimmed">Vielleicht ist sie nicht mehr aktuell. Schau dir die anderen Plätze an.</Text>
          <Button component={Link} to="/finden" color="wald">
            Zur Suche
          </Button>
        </Stack>
      </Container>
    );
  }

  const v = stelle.voraussetzungen;
  const alter =
    v.mindestalter != null && v.hoechstalter != null
      ? `${v.mindestalter}–${v.hoechstalter} Jahre`
      : v.mindestalter != null
        ? `ab ${v.mindestalter} Jahren`
        : v.hoechstalter != null
          ? `bis ${v.hoechstalter} Jahre`
          : null;

  const zeitraum =
    stelle.flexibler_start && !stelle.zeitraum_bis
      ? 'Flexibler Start'
      : [datumText(stelle.zeitraum_von), datumText(stelle.zeitraum_bis)].filter(Boolean).join(' – ') || null;

  const alleLinks = [stelle.quell_url, ...stelle.weitere_quell_urls].filter(Boolean);

  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Button
        component={Link}
        to="/finden"
        variant="subtle"
        color="wald"
        leftSection={<IconArrowLeft size={16} />}
        mb="lg"
        px={6}
      >
        Zurück zur Suche
      </Button>

      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 'lg', md: 48 }} align="flex-start">
        <Box style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Stack gap="md">
            <Group gap="sm">
              <Badge
                variant={stelle.programm === 'keins' ? 'light' : 'filled'}
                color={stelle.programm === 'keins' ? 'gray' : 'wald'}
                radius="sm"
                style={{ textTransform: 'none' }}
              >
                {PROGRAMM_LABEL[stelle.programm]}
              </Badge>
              <Group gap={4} c="wald.8">
                <IconMapPin size={16} />
                <Text fw={600}>
                  {stelle.land || 'Ortsunabhängig'}
                  {stelle.region ? ` · ${stelle.region}` : ''}
                </Text>
                {stelle.kontinent && <Text c="dimmed">({stelle.kontinent})</Text>}
              </Group>
            </Group>

            <Title order={1} fz={{ base: 30, md: 40 }} lh={1.1}>
              {stelle.titel}
            </Title>
            <Text size="lg" c="dimmed">
              {stelle.organisation}
            </Text>

            <TaetigkeitsPills felder={stelle.taetigkeitsfeld} />

            <Text fz="md" lh={1.7} mt="xs">
              {stelle.beschreibung}
            </Text>

            <Divider my="sm" />

            <Title order={3} fz="xl">
              Voraussetzungen
            </Title>
            <List spacing="xs" center>
              {alter && <List.Item>Alter: {alter}</List.Item>}
              {v.sprache && <List.Item>Sprache: {v.sprache}</List.Item>}
              {v.vorkenntnisse && <List.Item>{v.vorkenntnisse}</List.Item>}
              {!alter && !v.sprache && !v.vorkenntnisse && (
                <List.Item>Keine besonderen Voraussetzungen angegeben.</List.Item>
              )}
            </List>

            <Box
              mt="sm"
              p="md"
              style={{
                backgroundColor: 'var(--mantine-color-wald-0)',
                borderRadius: 14,
                border: '1px solid var(--mantine-color-wald-2)',
              }}
            >
              <Group gap={6} mb={4}>
                <Text fw={600}>{PROGRAMM_LABEL[stelle.programm]}</Text>
                <InfoTooltip label={PROGRAMM_TOOLTIP[stelle.programm]} />
              </Group>
              <Text size="sm" c="dark.4">
                {PROGRAMM_TOOLTIP[stelle.programm]}
              </Text>
            </Box>
          </Stack>
        </Box>

        <Box w={{ base: '100%', md: 360 }} style={{ flexShrink: 0 }}>
          <Card
            withBorder
            radius="lg"
            padding="lg"
            pt="xl"
            className="nz-accent"
            style={{
              position: 'sticky',
              top: 84,
              borderColor: 'var(--nz-line)',
              '--nz-accent': `var(--mantine-color-${feldFarbe(stelle.taetigkeitsfeld[0] ?? 'Sonstiges')}-5)`,
            } as CSSProperties}
          >
            <Stack gap="lg">
              <Text fw={600} fz="lg" className="nz-display">
                Auf einen Blick
              </Text>

              <FactRow
                icon={<IconClock size={18} />}
                label="Dauer"
                value={dauerText(stelle.dauer_monate_min, stelle.dauer_monate_max)}
              />
              {zeitraum && (
                <FactRow icon={<IconCalendar size={18} />} label="Zeitraum" value={zeitraum} />
              )}
              {stelle.bewerbungsfrist && (
                <FactRow
                  icon={<IconCalendar size={18} />}
                  label="Bewerbungsfrist"
                  value={datumText(stelle.bewerbungsfrist)}
                />
              )}

              <Divider />

              <div>
                <Text size="xs" c="dimmed" tt="uppercase" lts={0.5} mb={8}>
                  Leistungen
                </Text>
                <LeistungsBadges stelle={stelle} />
              </div>

              <Divider />

              <Stack gap={6}>
                <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
                  Quelle
                </Text>
                {alleLinks.map((url) => (
                  <Anchor key={url} href={url} target="_blank" rel="noopener noreferrer" size="sm">
                    <Group gap={4} wrap="nowrap">
                      <IconExternalLink size={14} />
                      <span>{quelleLabel(stelle.quelle)}</span>
                    </Group>
                  </Anchor>
                ))}
              </Stack>

              <Button
                component="a"
                href={stelle.quell_url}
                target="_blank"
                rel="noopener noreferrer"
                color="wald"
                size="md"
                rightSection={<IconArrowUpRight size={18} />}
                fullWidth
              >
                Zur Stelle &amp; Bewerbung
              </Button>
            </Stack>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
