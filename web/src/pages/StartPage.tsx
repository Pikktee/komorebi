import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
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
  IconFilter,
  IconArrowUpRight,
} from '@tabler/icons-react';
import { motion } from 'motion/react';
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
  const leafPaths = [
    // Buchenblatt
    'M16 4C9 4 6 10 6 16c0 6 5 12 10 12s10-6 10-12c0-6-3-12-10-12zm0 21c-1.5 0-3-.4-4.2-1l12-12c.2.6.2 1.3.2 2 0 6-5 11-10 11z',
    // Farnblatt
    'M16 2s-5 5-5 10c0 3 2.5 5 5 5s5-2 5-5c0-5-5-10-5-10z',
    // Ahornblatt (vereinfacht)
    'M16 2l3 6 7-1-4 5 5 7-7-2-5 5 2-8-6-4 8-2z',
    // Weidenblatt
    'M16 2C11 8 9 15 9 19c0 4 3 7 7 7s7-3 7-7c0-4-2-11-7-17z'
  ];

  return (
    <Box className="nz-canopy" aria-hidden="true">
      {Array.from({ length: 10 }).map((_, i) => {
        const path = leafPaths[i % leafPaths.length];
        return (
          <span key={i} className="nz-canopy__leaf">
            <svg width="24" height="24" viewBox="0 0 32 32">
              <path d={path} />
            </svg>
          </span>
        );
      })}
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
      <Container size="lg" py={{ base: 40, md: 52 }}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl">
          <RadarBlock titel="Top-Quellen" icon={<IconWorldSearch size={20} />}>
            <Card className="nz-glass-panel" p="md" radius="lg" style={{ height: '100%' }}>
              <Stack gap="md">
                {quellen.map(([label, count]) => (
                  <RadarBar key={label} label={label} count={count} max={maxQuelle} />
                ))}
              </Stack>
            </Card>
          </RadarBlock>
          <RadarBlock titel="Regionen" icon={<IconMap2 size={20} />}>
            <Card className="nz-glass-panel" p="md" radius="lg" style={{ height: '100%' }}>
              <Stack gap="md">
                {regionen.map(([label, count]) => (
                  <RadarBar key={label} label={label} count={count} max={maxRegion} />
                ))}
              </Stack>
            </Card>
          </RadarBlock>
          <RadarBlock titel="Datenqualität" icon={<IconShieldCheck size={20} />}>
            <Stack gap="xs" style={{ height: '100%', justifyContent: 'space-between' }}>
              <QualityLine label="Direkte Angebotslinks" value="100 %" />
              <QualityLine label="Doppelte URLs bereinigt" value={String(doppelteUrls)} />
              <QualityLine label="Aktive Datenquellen" value={String(quellenGesamt)} />
            </Stack>
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
        <Title order={3} fz="lg" className="nz-display">
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
        <Text size="sm" fw={700}>
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
    <Group justify="space-between" className="nz-quality-line" wrap="nowrap" style={{ flex: 1 }}>
      <Text size="sm" fw={600} c="dark.4">
        {label}
      </Text>
      <Text className="nz-display" fz="lg" fw={700}>
        {value}
      </Text>
    </Group>
  );
}

function InfografikSchritt({ nummer, titel, beschreibung, icon }: { nummer: number; titel: string; beschreibung: string; icon: ReactNode }) {
  return (
    <div className="nz-infographic-step">
      {nummer < 4 && <div className="nz-infographic-connector" />}
      <Card className="nz-glass-panel" p="lg" radius="lg" style={{ height: '100%', position: 'relative', zIndex: 2 }}>
        <Stack align="center" gap="xs" style={{ textAlign: 'center' }}>
          <ThemeIcon
            size={54}
            radius="xl"
            color="wald"
            variant="light"
            style={{
              border: '2px solid var(--mantine-color-wald-2)',
              boxShadow: '0 8px 20px -6px rgba(21, 107, 65, 0.15)',
            }}
          >
            {icon}
          </ThemeIcon>
          <Text fw={700} fz="md" mt="xs" className="nz-display">
            {titel}
          </Text>
          <Text size="xs" c="dimmed" style={{ lineHeight: 1.45 }}>
            {beschreibung}
          </Text>
        </Stack>
      </Card>
    </div>
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <>
      <Box className="nz-hero">
        <HeroCanopy />
        <Container size="lg" py={{ base: 64, md: 96 }}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Stack gap="xl" maw={790}>
              <motion.div variants={itemVariants}>
                <Group gap={10} c="rgba(234,245,238,0.85)">
                  <KomorebiMark size={24} ton="hell" />
                  <Text fz="xs" fw={700} tt="uppercase" lts={1.8}>
                    Ökologische Freiwilligenarbeit weltweit
                  </Text>
                </Group>
              </motion.div>
              
              <Stack gap="md">
                <motion.div variants={itemVariants}>
                  <Title className="nz-display" order={1} fz={{ base: 48, md: 76 }} lh={1.0} fw={650} style={{ letterSpacing: '-0.02em' }}>
                    Komorebi
                  </Title>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Text fz={{ base: 19, md: 22 }} c="rgba(234,245,238,0.92)" maw={670} style={{ lineHeight: 1.4 }}>
                    Finde geförderte Freiwilligendienste, Praxisstellen und Forschungsassistenzen für Naturschutz, Artenschutz und Feldarbeit an einem Ort.
                  </Text>
                </motion.div>
              </Stack>
              
              <motion.div variants={itemVariants}>
                <Group gap="sm">
                  <Button
                    component={Link}
                    to="/finden"
                    size="md"
                    radius="md"
                    color="sonne.4"
                    c="wald.9"
                    rightSection={<IconArrowRight size={18} />}
                    style={{
                      boxShadow: '0 8px 24px -6px rgba(243, 187, 67, 0.35)',
                      fontWeight: 700,
                    }}
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
                    styles={{ root: { borderColor: 'rgba(234,245,238,0.35)', color: '#eaf5ee' } }}
                  >
                    Gut vorbereitet
                  </Button>
                </Group>
              </motion.div>
              
              <motion.div variants={itemVariants} style={{ width: '100%' }}>
                <SimpleGrid cols={{ base: 1, xs: 3 }} spacing="sm" maw={700} mt="lg">
                  <Stat wert={stellen.length || '—'} label="offene Stellen" icon={<IconSearch size={18} />} />
                  <Stat wert={laender || '—'} label="Länder" icon={<IconMap2 size={18} />} />
                  <Stat
                    wert={kostenlos || '—'}
                    label="Kost & Logis inklusive"
                    icon={<IconHeartHandshake size={18} />}
                  />
                </SimpleGrid>
              </motion.div>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      {/* Timeline Infografik Sektion */}
      <Container size="lg" py={{ base: 48, md: 64 }}>
        <Stack gap="xs" mb="xl" align="center" style={{ textAlign: 'center' }}>
          <Text fw={700} c="dimmed" tt="uppercase" fz="xs" lts={1.5}>
            Wie es funktioniert
          </Text>
          <Title order={2} className="nz-display" fz={{ base: 28, md: 36 }}>
            Dein Weg ins grüne Abenteuer
          </Title>
          <Text size="sm" c="dimmed" maw={520}>
            Komorebi hilft dir, aus dem weltweiten Rauschen die passenden, geförderten Naturschutzprojekte herauszufiltern.
          </Text>
        </Stack>

        <SimpleGrid cols={{ base: 1, sm: 4 }} spacing="lg" mt="md">
          <InfografikSchritt
            nummer={1}
            titel="1. Suchen & Finden"
            beschreibung="Stöbere durch täglich aktualisierte Angebote von verifizierten Quellen weltweit."
            icon={<IconSearch size={22} />}
          />
          <InfografikSchritt
            nummer={2}
            titel="2. Filter setzen"
            beschreibung="Filtere nach Kontinent, Dauer oder Freier Kost & Logis. Dein Such-Link bleibt teilbar."
            icon={<IconFilter size={22} />}
          />
          <InfografikSchritt
            nummer={3}
            titel="3. Qualität vertrauen"
            beschreibung="Unsere zweistufige Pipeline sortiert kommerzielle Job-Attrappen und Rauschen aus."
            icon={<IconShieldCheck size={22} />}
          />
          <InfografikSchritt
            nummer={4}
            titel="4. Direkt bewerben"
            beschreibung="Bewirb dich direkt bei der Organisation vor Ort. Keine Portalgebühren, kein Vermittler."
            icon={<IconArrowUpRight size={22} />}
          />
        </SimpleGrid>
      </Container>

      <Container size="lg" pb={{ base: 38, md: 56 }}>
        <Stack gap="xs" mb="md">
          <Text fw={700} c="dimmed" tt="uppercase" fz="xs" lts={1.5}>
            Schneller Einstieg
          </Text>
          <Title order={2} className="nz-display" fz={{ base: 26, md: 34 }}>
            Wähle ein Tätigkeitsfeld
          </Title>
        </Stack>
        <Group gap="xs">
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

      {/* Über das Projekt Sektion mit KI-Bild */}
      <Container size="lg" py={{ base: 42, md: 58 }}>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing={48} style={{ alignItems: 'center' }}>
          <Box style={{ position: 'relative' }}>
            <Box
              style={{
                position: 'absolute',
                inset: 12,
                borderRadius: 24,
                backgroundColor: 'var(--mantine-color-wald-1)',
                transform: 'rotate(-2deg)',
                zIndex: 0,
              }}
            />
            <img
              src="/volunteer_nature.png"
              alt="Freiwillige pflanzt Setzling im Wald"
              style={{
                width: '100%',
                maxHeight: 400,
                objectFit: 'cover',
                borderRadius: 20,
                border: '1px solid var(--nz-line)',
                boxShadow: '0 12px 36px -12px rgba(10, 42, 27, 0.25)',
                position: 'relative',
                zIndex: 1,
                display: 'block',
              }}
            />
          </Box>
          <Stack gap="md">
            <Text fw={700} c="dimmed" tt="uppercase" fz="xs" lts={1.5}>
              Über das Projekt
            </Text>
            <Title order={2} className="nz-display" fz={{ base: 28, md: 36 }} lh={1.15}>
              Vom Hörsaal direkt in die Wildnis
            </Title>
            <Text size="sm" c="dark.5" style={{ lineHeight: 1.6 }}>
              Komorebi wurde ursprünglich als persönliches Hilfsmittel für eine angehende Biologin entwickelt, um die weltweite Suche nach Feldforschungs- und Naturschutzpraktika zu erleichtern.
            </Text>
            <Text size="sm" c="dark.5" style={{ lineHeight: 1.6 }}>
              Da kommerzielle Anbieter oft horrende Vermittlungsgebühren verlangen (die sogenannte „Voluntourism“-Falle), filtert Komorebi diese Angebote mithilfe einer zweistufigen Eignungsprüfung automatisch aus. So findest du hier nur echte, verifizierte und meist geförderte Stellen mit freier Kost und Logis.
            </Text>
            <Group gap="sm" mt="xs">
              <Button component={Link} to="/ueber" variant="outline" color="wald" radius="md" style={{ fontWeight: 700 }}>
                Mehr erfahren
              </Button>
            </Group>
          </Stack>
        </SimpleGrid>
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
                  <Text fw={700} c="dimmed" tt="uppercase" fz="sm" lts={1}>
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
                <Text fw={700} c="dimmed" tt="uppercase" fz="sm" lts={1}>
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
