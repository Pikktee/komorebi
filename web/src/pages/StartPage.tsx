import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBinoculars,
  IconBook2,
  IconCalendarPlus,
  IconHeartHandshake,
  IconLeaf,
  IconMap2,
  IconSearch,
  IconShieldCheck,
  IconWorldSearch,
} from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import { StelleCard } from '../components/StelleCard';
import { feldFarbe } from '../components/TaetigkeitsPills';
import { KomorebiMark } from '../components/Logo';
import { quelleLabel } from '../lib/labels';
import type { Stelle } from '../types';

const SCHNELL_FELDER = [
  { feld: 'Naturschutz', icon: <IconLeaf size={17} /> },
  { feld: 'Artenschutz/Tiere', icon: <IconBinoculars size={17} /> },
  { feld: 'Meeresschutz', icon: <IconWorldSearch size={17} /> },
  { feld: 'Forschung/Feldassistenz', icon: <IconSearch size={17} /> },
  { feld: 'Wald/Forst', icon: <IconMap2 size={17} /> },
];

function HeroCanopy() {
  return (
    <Box className="nz-canopy" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span key={i} className="nz-canopy__leaf" />
      ))}
    </Box>
  );
}

function Stat({ wert, label, icon }: { wert: string | number; label: string; icon: ReactNode }) {
  return (
    <Group gap="sm" wrap="nowrap" className="nz-hero-stat">
      <Box className="nz-hero-stat__icon">{icon}</Box>
      <Stack gap={1}>
        <Text className="nz-display" fz={{ base: 26, md: 34 }} fw={650} lh={1} c="sonne.3">
          {wert}
        </Text>
        <Text size="xs" c="rgba(234,245,238,0.76)">
          {label}
        </Text>
      </Stack>
    </Group>
  );
}

function topEintraege(stellen: Stelle[], key: (s: Stelle) => string, limit = 4) {
  const counts = new Map<string, number>();
  for (const stelle of stellen) {
    const wert = key(stelle);
    if (!wert) continue;
    counts.set(wert, (counts.get(wert) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'de'))
    .slice(0, limit);
}

function DatenRadar({ stellen }: { stellen: Stelle[] }) {
  const quellen = topEintraege(stellen, (s) => quelleLabel(s.quelle), 3);
  const quellenGesamt = topEintraege(stellen, (s) => quelleLabel(s.quelle), 20).length;
  const regionen = topEintraege(stellen, (s) => s.kontinent, 4);
  const doppelteUrls = Math.max(0, stellen.length - new Set(stellen.map((s) => s.quell_url)).size);
  const maxQuelle = Math.max(1, ...quellen.map(([, count]) => count));
  const maxRegion = Math.max(1, ...regionen.map(([, count]) => count));

  return (
    <Box className="nz-data-band">
      <Container size="lg" py={{ base: 34, md: 46 }}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          <RadarBlock titel="Quellenmix" icon={<IconWorldSearch size={20} />}>
            {quellen.map(([label, count]) => (
              <RadarBar key={label} label={label} count={count} max={maxQuelle} />
            ))}
          </RadarBlock>
          <RadarBlock titel="Regionen" icon={<IconMap2 size={20} />}>
            {regionen.map(([label, count]) => (
              <RadarBar key={label} label={label} count={count} max={maxRegion} />
            ))}
          </RadarBlock>
          <RadarBlock titel="Qualität" icon={<IconShieldCheck size={20} />}>
            <QualityLine label="Konkrete Angebotslinks" value="100 %" />
            <QualityLine label="Doppelte URLs" value={String(doppelteUrls)} />
            <QualityLine label="Aktive Quellen" value={String(quellenGesamt)} />
          </RadarBlock>
        </SimpleGrid>
      </Container>
    </Box>
  );
}

function RadarBlock({ titel, icon, children }: { titel: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Stack gap="sm">
      <Group gap="xs">
        <Box className="nz-data-icon">{icon}</Box>
        <Title order={3} fz="lg">
          {titel}
        </Title>
      </Group>
      {children}
    </Stack>
  );
}

function RadarBar({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <Stack gap={5}>
      <Group justify="space-between" gap="md" wrap="nowrap">
        <Text size="sm" fw={600} lineClamp={1}>
          {label}
        </Text>
        <Text size="sm" c="dimmed" fw={600}>
          {count}
        </Text>
      </Group>
      <Box className="nz-meter" aria-hidden="true">
        <span style={{ width: `${Math.max(8, (count / max) * 100)}%` }} />
      </Box>
    </Stack>
  );
}

function QualityLine({ label, value }: { label: string; value: string }) {
  return (
    <Group justify="space-between" className="nz-quality-line" wrap="nowrap">
      <Text size="sm" fw={600}>
        {label}
      </Text>
      <Text className="nz-display" fw={650} c="wald.8">
        {value}
      </Text>
    </Group>
  );
}

export function StartPage() {
  const { stellen } = useStellen();
  const laender = new Set(stellen.map((s) => s.land).filter(Boolean)).size;
  const kostenlos = stellen.filter((s) => s.kost_unterkunft_frei && !s.kostenpflichtig).length;
  const neueste = [...stellen]
    .sort((a, b) => b.erstmals_gesehen.localeCompare(a.erstmals_gesehen))
    .slice(0, 3);
  const featured = stellen
    .filter((s) => s.kost_unterkunft_frei && !s.kostenpflichtig)
    .slice(0, 3);

  return (
    <>
      <Box className="nz-hero">
        <HeroCanopy />
        <Container size="lg" py={{ base: 58, md: 92 }}>
          <Stack gap="xl" maw={790} className="nz-rise">
            <Group gap={10} c="rgba(234,245,238,0.85)">
              <KomorebiMark size={24} ton="hell" />
              <Text fz="sm" fw={700} tt="uppercase" lts={1.4}>
                ökologische Stellen weltweit
              </Text>
            </Group>
            <Stack gap="md">
              <Title className="nz-display" order={1} fz={{ base: 46, md: 74 }} lh={1.02} fw={650}>
                Komorebi
              </Title>
              <Text fz={{ base: 19, md: 23 }} c="rgba(234,245,238,0.9)" maw={650}>
                Freiwilligen-, Praxis- und Feldstellen für Naturschutz, Artenschutz,
                Meeresschutz und ökologische Forschung.
              </Text>
            </Stack>
            <Group gap="sm">
              <Button
                component={Link}
                to="/finden"
                size="md"
                radius="md"
                color="sonne.4"
                c="wald.9"
                rightSection={<IconArrowRight size={18} />}
              >
                Stellen finden
              </Button>
              <Button
                component={Link}
                to="/wissen"
                size="md"
                radius="md"
                variant="outline"
                leftSection={<IconBook2 size={18} />}
                styles={{ root: { borderColor: 'rgba(234,245,238,0.42)', color: '#eaf5ee' } }}
              >
                Gut vorbereitet
              </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="sm" maw={670}>
              <Stat wert={stellen.length || '—'} label="offene Stellen" icon={<IconSearch size={17} />} />
              <Stat wert={laender || '—'} label="Länder" icon={<IconMap2 size={17} />} />
              <Stat
                wert={kostenlos || '—'}
                label="mit freier Kost & Logis"
                icon={<IconHeartHandshake size={17} />}
              />
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py={{ base: 38, md: 56 }}>
        <Stack gap="xs" mb="md">
          <Text fw={700} c="wald.8" tt="uppercase" fz="sm" lts={1}>
            Schneller Einstieg
          </Text>
          <Title order={2} className="nz-display" fz={{ base: 26, md: 34 }}>
            Wähle ein Tätigkeitsfeld
          </Title>
        </Stack>
        <Group gap="sm">
          {SCHNELL_FELDER.map(({ feld, icon }) => (
            <Tooltip
              key={feld}
              label={`Zeigt Stellen im Bereich ${feld}.`}
              withArrow
              events={{ hover: true, focus: true, touch: true }}
            >
              <Button
                component={Link}
                to={`/finden?feld=${encodeURIComponent(feld)}`}
                variant="light"
                radius="md"
                color={feldFarbe(feld)}
                leftSection={icon}
                className="nz-quick-field"
              >
                {feld}
              </Button>
            </Tooltip>
          ))}
        </Group>
      </Container>

      <DatenRadar stellen={stellen} />

      <Container size="lg" py={{ base: 42, md: 64 }}>
        {neueste.length > 0 && (
          <>
            <Group justify="space-between" align="flex-end" mb="lg">
              <Stack gap="xs">
                <Group gap={8}>
                  <Box className="nz-section-icon" aria-hidden="true">
                    <IconCalendarPlus size={18} />
                  </Box>
                  <Text fw={700} c="wald.8" tt="uppercase" fz="sm" lts={1}>
                    Neu hinzugekommen
                  </Text>
                </Group>
                <Title order={2} className="nz-display" fz={{ base: 26, md: 34 }}>
                  Frisch eingetragene Angebote
                </Title>
              </Stack>
              <Button
                component={Link}
                to="/finden?sort=neu"
                variant="subtle"
                color="wald"
                rightSection={<IconArrowRight size={16} />}
                visibleFrom="sm"
              >
                Alle neuen ansehen
              </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg" mb={{ base: 44, md: 62 }}>
              {neueste.map((s) => (
                <StelleCard key={s.id} stelle={s} showAddedDate />
              ))}
            </SimpleGrid>
          </>
        )}

        {featured.length > 0 && (
          <>
            <Group justify="space-between" align="flex-end" mb="lg">
              <Stack gap="xs">
                <Text fw={700} c="wald.8" tt="uppercase" fz="sm" lts={1}>
                  Reinschnuppern
                </Text>
                <Title order={2} className="nz-display" fz={{ base: 26, md: 34 }}>
                  Plätze mit freier Kost & Unterkunft
                </Title>
              </Stack>
              <Button
                component={Link}
                to="/finden"
                variant="subtle"
                color="wald"
                rightSection={<IconArrowRight size={16} />}
                visibleFrom="sm"
              >
                Alle ansehen
              </Button>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {featured.map((s) => (
                <StelleCard key={s.id} stelle={s} />
              ))}
            </SimpleGrid>
          </>
        )}
      </Container>
    </>
  );
}
