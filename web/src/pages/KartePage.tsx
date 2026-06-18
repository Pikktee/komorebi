import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  Group,
  Indicator,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAdjustmentsHorizontal,
  IconAlertCircle,
  IconCalendarStats,
  IconFilter,
  IconList,
  IconMap,
  IconX,
} from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import {
  anzahlAktiverFilter,
  filterStellen,
  filterToParams,
  parseFilter,
  type Filter,
} from '../lib/filter';
import { datumText, PROGRAMM_LABEL } from '../lib/labels';
import { FilterPanel } from '../components/FilterPanel';
import { StellenKarte } from '../components/StellenKarte';
import { InfoTooltip } from '../components/InfoTooltip';

export function KartePage() {
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

  // Divide into geocoded and non-geocoded
  const aufKarte = useMemo(
    () => gefiltert.filter((s) => s.geo_lat !== null && s.geo_lon !== null),
    [gefiltert],
  );
  const ohneKoordCount = gefiltert.length - aufKarte.length;

  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Box className="nz-finder-head" mb="xl">
        <Group justify="space-between" align="flex-end" gap="lg">
          <Stack gap={6}>
            <Group gap={6}>
              <Title order={1} fz={{ base: 32, md: 42 }} className="nz-display">
                Interaktive Weltkarte
              </Title>
              <InfoTooltip label="Durchstöbere Stellen räumlich. Filter werden live angewendet und sind in der URL gespeichert." />
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="wald" radius="sm" leftSection={<IconFilter size={13} />} style={{ border: '1px solid var(--mantine-color-wald-2)' }}>
                {aktiv} aktiv
              </Badge>
              <Badge variant="light" color="himmel" radius="sm" style={{ border: '1px solid var(--mantine-color-himmel-2)' }}>
                {loading ? 'Lade …' : `${aufKarte.length} auf Karte`}
              </Badge>
              {generiertAm && (
                <Badge variant="outline" color="gray" radius="sm" leftSection={<IconCalendarStats size={13} />}>
                  Aktualisiert: {datumText(generiertAm)}
                </Badge>
              )}
            </Group>
          </Stack>

          {/* List/Map toggle with parameters preserved */}
          <Group gap="xs">
            <Button
              component={Link}
              to={`/finden?${params.toString()}`}
              variant="default"
              leftSection={<IconList size={16} />}
              size="sm"
            >
              Listenansicht
            </Button>
            <Button
              variant="filled"
              color="wald"
              leftSection={<IconMap size={16} />}
              size="sm"
              disabled
            >
              Kartenansicht
            </Button>
          </Group>
        </Group>
      </Box>

      {/* Active Filter Chips */}
      {aktiv > 0 && (
        <Group gap="xs" mb="lg" wrap="wrap">
          {filter.q.trim() && (
            <Badge
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, q: '' })} />}
            >
              Suche: {filter.q}
            </Badge>
          )}
          {filter.laender.map((l) => (
            <Badge
              key={l}
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, laender: filter.laender.filter((x) => x !== l) })} />}
            >
              {l}
            </Badge>
          ))}
          {filter.felder.map((f) => (
            <Badge
              key={f}
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, felder: filter.felder.filter((x) => x !== f) })} />}
            >
              Bereich: {f}
            </Badge>
          ))}
          {filter.kontinente.map((k) => (
            <Badge
              key={k}
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, kontinente: filter.kontinente.filter((x) => x !== k) })} />}
            >
              {k}
            </Badge>
          ))}
          {filter.programme.map((p) => (
            <Badge
              key={p}
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, programme: filter.programme.filter((x) => x !== p) })} />}
            >
              {PROGRAMM_LABEL[p as keyof typeof PROGRAMM_LABEL] || p}
            </Badge>
          ))}
          {filter.dauerMax != null && (
            <Badge
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, dauerMax: null })} />}
            >
              Dauer: ≤ {filter.dauerMax} Mon.
            </Badge>
          )}
          {filter.nurFrei && (
            <Badge
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, nurFrei: false })} />}
            >
              Kost & Unterkunft frei
            </Badge>
          )}
          {!filter.ohneGebuehr && (
            <Badge
              variant="light"
              color="wald"
              size="sm"
              pr={3}
              rightSection={<IconX size={12} style={{ cursor: 'pointer' }} onClick={() => setFilter({ ...filter, ohneGebuehr: true })} />}
            >
              Mit Gebühren
            </Badge>
          )}
        </Group>
      )}

      {/* Info notice about hidden positions with no coordinates */}
      {!loading && !error && ohneKoordCount > 0 && (
        <Alert color="himmel" mb="lg" radius="md" style={{ border: '1px solid var(--mantine-color-himmel-2)' }}>
          <Group justify="space-between" align="center" gap="sm">
            <Text size="sm">
              Hinweis: <strong>{ohneKoordCount} {ohneKoordCount === 1 ? 'Stelle' : 'Stellen'}</strong> ohne genaue Ortsangabe („Ort offen“) werden auf der Karte nicht angezeigt.
            </Text>
            <Button
              component={Link}
              to={`/finden?${params.toString()}`}
              variant="subtle"
              color="wald"
              size="xs"
              style={{ fontWeight: 600 }}
            >
              In der Liste anzeigen &rarr;
            </Button>
          </Group>
        </Alert>
      )}

      <Group align="flex-start" gap="xl" wrap="nowrap">
        {/* Desktop Sidebar */}
        <Box
          w={300}
          visibleFrom="md"
          style={{ position: 'sticky', top: 84, flexShrink: 0 }}
        >
          <Box className="nz-panel nz-glass-panel" p="lg" style={{ borderRadius: 12 }}>
            <Text fw={700} className="nz-display" fz="lg" mb="md">
              Filter
            </Text>
            <FilterPanel filter={filter} onChange={setFilter} laenderOptions={laenderOptions} />
          </Box>
        </Box>

        {/* Map Area */}
        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" mb="md" hiddenFrom="md">
            <Text fw={650}>
              {loading ? 'Lade Karte …' : `${aufKarte.length} Stellen auf Karte`}
            </Text>
            <Indicator label={aktiv} disabled={aktiv === 0} color="terra" size={18}>
              <Button
                variant="default"
                leftSection={<IconAdjustmentsHorizontal size={18} />}
                onClick={open}
              >
                Filter
              </Button>
            </Indicator>
          </Group>

          {error && (
            <Alert color="terra" icon={<IconAlertCircle />} title="Karte konnte nicht geladen werden">
              {error}
            </Alert>
          )}

          {loading && (
            <Skeleton height={500} radius="md" />
          )}

          {!loading && !error && (
            <StellenKarte stellen={aufKarte} height="65vh" />
          )}
        </Box>
      </Group>

      {/* Mobile Drawer */}
      <Drawer
        opened={drawer}
        onClose={close}
        title="Filter"
        position="bottom"
        size="90dvh"
        padding="lg"
        closeButtonProps={{ 'aria-label': 'Filter schließen' }}
        styles={{
          content: { backgroundColor: 'var(--nz-cream)', display: 'flex', flexDirection: 'column' },
          header: { backgroundColor: 'var(--nz-cream)' },
          body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
        }}
      >
        <Box style={{ flex: 1, overflowY: 'auto', padding: '0 var(--mantine-spacing-lg) var(--mantine-spacing-lg)' }}>
          <FilterPanel filter={filter} onChange={setFilter} laenderOptions={laenderOptions} />
        </Box>
        <Box style={{ 
          padding: 'var(--mantine-spacing-md) var(--mantine-spacing-lg)', 
          borderTop: '1px solid var(--nz-line)', 
          backgroundColor: 'var(--nz-cream)',
          position: 'sticky',
          bottom: 0,
          zIndex: 10
        }}>
          <Button fullWidth color="wald" size="md" onClick={close}>
            {aufKarte.length} {aufKarte.length === 1 ? 'Stelle' : 'Stellen'} anzeigen
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}
