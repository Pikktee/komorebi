import { useMemo, useState, useEffect } from 'react';
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
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconAdjustmentsHorizontal, IconAlertCircle, IconCalendarStats, IconFilter, IconList, IconMap } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';
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
import { AktiveFilterChips } from '../components/AktiveFilterChips';
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

  // Incremental loading state
  const [visibleCount, setVisibleCount] = useState(24);
  useEffect(() => {
    setVisibleCount(24);
  }, [params]);

  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Box className="nz-finder-head" mb="xl">
        <Group justify="space-between" align="flex-end" gap="lg">
          <Stack gap={6}>
            <Group gap={6}>
              <Title order={1} fz={{ base: 32, md: 42 }} className="nz-display">
                Stellen finden
              </Title>
              <InfoTooltip label="Deine Filter werden in der URL gespeichert. Du kannst die Suche also direkt teilen oder später wieder öffnen." />
            </Group>
            <Group gap="xs">
              <Badge variant="light" color="wald" radius="sm" leftSection={<IconFilter size={13} />} style={{ border: '1px solid var(--mantine-color-wald-2)' }}>
                {aktiv} aktiv
              </Badge>
              <Badge variant="light" color="himmel" radius="sm" style={{ border: '1px solid var(--mantine-color-himmel-2)' }}>
                {loading ? 'Lade …' : `${gefiltert.length} Treffer`}
              </Badge>
              {generiertAm && (
                <Badge variant="outline" color="gray" radius="sm" leftSection={<IconCalendarStats size={13} />}>
                  Aktualisiert: {datumText(generiertAm)}
                </Badge>
              )}
            </Group>
          </Stack>
          <Group gap="md">
            <Text c="dimmed" maw={300} visibleFrom="lg" style={{ lineHeight: 1.4 }}>
              Ökologische Freiwilligen-, Praxis- und Feldstellen aus geprüften Quellen.
            </Text>
            <Group gap="xs">
              <Button
                variant="filled"
                color="wald"
                leftSection={<IconList size={16} />}
                size="sm"
                disabled
              >
                Listenansicht
              </Button>
              <Button
                component={Link}
                to={`/karte?${params.toString()}`}
                variant="default"
                leftSection={<IconMap size={16} />}
                size="sm"
              >
                Kartenansicht
              </Button>
            </Group>
          </Group>
        </Group>
      </Box>

      {/* Aktive Filter-Chips */}
      {aktiv > 0 && <AktiveFilterChips filter={filter} onChange={setFilter} />}

      <Group align="flex-start" gap="xl" wrap="nowrap">
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

        <Box style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" mb="md">
            <Text fw={650}>
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
            <Stack align="center" gap="md" py={64}>
              <KomorebiMark size={52} />
              <Text fw={600} fz="lg">
                Hier wächst gerade nichts
              </Text>
              <Text c="dimmed" ta="center" maw={420}>
                Mit diesen Filtern haben wir leider keine passenden Stellen gefunden.
              </Text>

              <Group gap="xs" justify="center" mt="xs">
                {filter.ohneGebuehr && (
                  <Button size="xs" variant="outline" color="wald" onClick={() => setFilter({ ...filter, ohneGebuehr: false })}>
                    Gebühr-Filter lockern
                  </Button>
                )}
                {filter.dauerMax != null && (
                  <Button size="xs" variant="outline" color="wald" onClick={() => setFilter({ ...filter, dauerMax: null })}>
                    Dauer-Filter entfernen
                  </Button>
                )}
                {filter.frist !== 'egal' && (
                  <Button size="xs" variant="outline" color="wald" onClick={() => setFilter({ ...filter, frist: 'egal' })}>
                    Frist-Filter entfernen
                  </Button>
                )}
                {(filter.laender.length > 0 || filter.kontinente.length > 0) && (
                  <Button size="xs" variant="outline" color="wald" onClick={() => setFilter({ ...filter, laender: [], kontinente: [] })}>
                    Weltweit suchen
                  </Button>
                )}
                {filter.q.trim() !== '' && (
                  <Button size="xs" variant="outline" color="wald" onClick={() => setFilter({ ...filter, q: '' })}>
                    Suchbegriff entfernen
                  </Button>
                )}
                <Button size="xs" variant="light" color="terra" onClick={() => setFilter({ ...DEFAULT_FILTER })}>
                  Alle Filter zurücksetzen
                </Button>
              </Group>
            </Stack>
          )}

          {!loading && !error && gefiltert.length > 0 && (
            <Stack gap="xl">
              <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="lg">
                <AnimatePresence mode="popLayout">
                  {gefiltert.slice(0, visibleCount).map((s) => (
                    <motion.div
                      key={s.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96, y: -15 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      style={{ height: '100%' }}
                    >
                      <StelleCard stelle={s} showAddedDate={filter.sort === 'neu'} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </SimpleGrid>

              {gefiltert.length > visibleCount && (
                <Group justify="center" mt="md">
                  <Button variant="outline" color="wald" onClick={() => setVisibleCount((prev) => prev + 24)}>
                    Weitere anzeigen
                  </Button>
                </Group>
              )}
            </Stack>
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
            {gefiltert.length} {gefiltert.length === 1 ? 'Stelle' : 'Stellen'} anzeigen
          </Button>
        </Box>
      </Drawer>
    </Container>
  );
}
