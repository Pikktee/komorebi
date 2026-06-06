import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  Group,
  Indicator,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconAlertCircle, IconCalendarStats, IconFilter } from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import { KomorebiMark } from '../components/Logo';
import {
  anzahlAktiverFilter,
  DEFAULT_FILTER,
  filterStellen,
  filterToParams,
  parseFilter,
  type Filter,
} from '../lib/filter';
import { datumText } from '../lib/labels';
import { FilterPanel } from '../components/FilterPanel';
import { StelleCard } from '../components/StelleCard';
import { InfoTooltip } from '../components/InfoTooltip';

export function FindenPage() {
  const { stellen, loading, error, generiertAm } = useStellen();
  const [params, setParams] = useSearchParams();
  const [drawer, { open, close }] = useDisclosure(false);

  const filter = useMemo(() => parseFilter(params), [params]);
  const setFilter = (f: Filter) => setParams(filterToParams(f), { replace: true });

  const laenderOptions = useMemo(
    () => Array.from(new Set(stellen.map((s) => s.land).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'de')),
    [stellen],
  );

  const gefiltert = useMemo(() => filterStellen(stellen, filter), [stellen, filter]);
  const aktiv = anzahlAktiverFilter(filter);

  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Box className="nz-finder-head" mb="xl">
        <Group justify="space-between" align="flex-end" gap="lg">
          <Stack gap={6}>
            <Group gap={6}>
              <Title order={1} fz={{ base: 32, md: 42 }}>
                Stellen finden
              </Title>
              <InfoTooltip label="Deine Filter werden in der URL gespeichert. Du kannst die Suche also direkt teilen oder später wieder öffnen." />
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="wald" radius="sm" leftSection={<IconFilter size={13} />}>
                {aktiv} aktiv
              </Badge>
              <Badge variant="light" color="himmel" radius="sm">
                {loading ? 'Lade …' : `${gefiltert.length} Treffer`}
              </Badge>
              {generiertAm && (
                <Badge variant="outline" color="gray" radius="sm" leftSection={<IconCalendarStats size={13} />}>
                  {datumText(generiertAm)}
                </Badge>
              )}
            </Group>
          </Stack>
          <Text c="dimmed" maw={420} visibleFrom="md">
            Ökologische Freiwilligen-, Praxis- und Feldstellen aus geprüften Quellen.
          </Text>
        </Group>
      </Box>

      <Group align="flex-start" gap="xl" wrap="nowrap">
        <Box
          w={300}
          visibleFrom="md"
          style={{ position: 'sticky', top: 84, flexShrink: 0 }}
        >
          <Box className="nz-panel" p="lg" style={{ borderRadius: 8 }}>
            <Text fw={600} className="nz-display" fz="lg" mb="md">
              Filter
            </Text>
            <FilterPanel filter={filter} onChange={setFilter} laenderOptions={laenderOptions} />
          </Box>
        </Box>

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" mb="md">
            <Text fw={600}>
              {loading ? 'Lade Stellen …' : `${gefiltert.length} ${gefiltert.length === 1 ? 'Stelle' : 'Stellen'}`}
            </Text>
            <Indicator label={aktiv} disabled={aktiv === 0} color="terra" size={18} hiddenFrom="md">
              <Button
                hiddenFrom="md"
                variant="default"
                leftSection={<IconAdjustmentsHorizontal size={18} />}
                onClick={open}
              >
                Filter
              </Button>
            </Indicator>
          </Group>

          {error && (
            <Alert color="terra" icon={<IconAlertCircle />} title="Daten konnten nicht geladen werden">
              {error}
            </Alert>
          )}

          {loading && (
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} height={260} radius="md" />
              ))}
            </SimpleGrid>
          )}

          {!loading && !error && gefiltert.length === 0 && (
            <Stack align="center" gap="sm" py={64}>
              <KomorebiMark size={52} />
              <Text fw={600} fz="lg">
                Hier wächst gerade nichts
              </Text>
              <Text c="dimmed" ta="center" maw={420}>
                Mit diesen Filtern haben wir nichts gefunden. Lockere die Auswahl oder setze die
                Filter zurück.
              </Text>
              <Button variant="light" color="wald" onClick={() => setFilter({ ...DEFAULT_FILTER })}>
                Filter zurücksetzen
              </Button>
            </Stack>
          )}

          {!loading && !error && gefiltert.length > 0 && (
            <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
              {gefiltert.map((s) => (
                <StelleCard key={s.id} stelle={s} showAddedDate={filter.sort === 'neu'} />
              ))}
            </SimpleGrid>
          )}
        </Box>
      </Group>

      <Drawer
        opened={drawer}
        onClose={close}
        title="Filter"
        position="bottom"
        size="90dvh"
        padding="lg"
        styles={{
          content: { backgroundColor: 'var(--nz-cream)' },
          header: { backgroundColor: 'var(--nz-cream)' },
          body: { paddingBottom: 24 },
        }}
      >
        <FilterPanel filter={filter} onChange={setFilter} laenderOptions={laenderOptions} />
        <Button fullWidth mt="lg" color="wald" onClick={close}>
          {gefiltert.length} {gefiltert.length === 1 ? 'Stelle' : 'Stellen'} anzeigen
        </Button>
      </Drawer>
    </Container>
  );
}
