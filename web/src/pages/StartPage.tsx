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
} from '@mantine/core';
import {
  IconArrowRight,
  IconSeeding,
  IconWorldSearch,
  IconHeartHandshake,
  IconBook2,
} from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import { StelleCard } from '../components/StelleCard';
import { feldFarbe } from '../components/TaetigkeitsPills';
import { KomorebiMark } from '../components/Logo';

const SCHNELL_FELDER = [
  'Naturschutz',
  'Artenschutz/Tiere',
  'Meeresschutz',
  'Forschung/Feldassistenz',
  'Wald/Forst',
];

/** Dekoratives Lichtspiel: goldene Lichtflecken & schwebende Blätter im Hero. */
function Lichtspiel() {
  const blatt = 'M0 16C-1 6 7 -1 18 -1C16 9 9 16 0 16Z';
  return (
    <svg
      className="nz-flightpath"
      viewBox="0 0 1200 500"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {/* weiche Lichtflecken */}
      {[
        { x: 250, y: 120, r: 60, o: 0.10 },
        { x: 980, y: 80, r: 120, o: 0.16 },
        { x: 700, y: 300, r: 40, o: 0.12 },
        { x: 1080, y: 320, r: 70, o: 0.10 },
        { x: 120, y: 360, r: 30, o: 0.12 },
      ].map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#f3bb43" opacity={d.o} />
      ))}
      {/* schwebende Blätter */}
      {[
        { x: 230, y: 330, s: 2.0, rot: -18 },
        { x: 900, y: 250, s: 2.8, rot: 22 },
        { x: 1050, y: 120, s: 1.6, rot: 8 },
      ].map((d, i) => (
        <g
          key={i}
          className="nz-bird"
          transform={`translate(${d.x} ${d.y}) rotate(${d.rot}) scale(${d.s})`}
          opacity="0.5"
        >
          <path d={blatt} fill="#9fd3b3" />
        </g>
      ))}
    </svg>
  );
}

function Stat({ wert, label }: { wert: string | number; label: string }) {
  return (
    <Stack gap={2}>
      <Text className="nz-display" fz={{ base: 30, md: 40 }} fw={600} lh={1} c="sonne.3">
        {wert}
      </Text>
      <Text size="sm" c="rgba(234,245,238,0.78)">
        {label}
      </Text>
    </Stack>
  );
}

export function StartPage() {
  const { stellen } = useStellen();
  const laender = new Set(stellen.map((s) => s.land).filter(Boolean)).size;
  const kostenlos = stellen.filter((s) => s.kost_unterkunft_frei && !s.kostenpflichtig).length;
  const featured = stellen
    .filter((s) => s.kost_unterkunft_frei && !s.kostenpflichtig)
    .slice(0, 3);

  return (
    <>
      <Box className="nz-hero">
        <Lichtspiel />
        <Container size="lg" py={{ base: 60, md: 96 }} pb={{ base: 80, md: 120 }}>
          <Stack gap="xl" maw={800} className="nz-rise">
            <Group gap={10} c="rgba(234,245,238,0.85)">
              <KomorebiMark size={24} ton="hell" />
              <Text fz="sm" fw={600} tt="uppercase" lts={1.5}>
                ökologische Freiwilligendienste weltweit
              </Text>
            </Group>
            <Title className="nz-display" order={1} fz={{ base: 42, md: 68 }} lh={1.04} fw={600}>
              Finde deinen Platz in der{' '}
              <Text span inherit c="sonne.4">
                Natur
              </Text>
              .
            </Title>
            <Text fz={{ base: 17, md: 20 }} c="rgba(234,245,238,0.9)" maw={660}>
              Naturschutz, Artenschutz und Feldforschung – weltweit an einem Ort. Filtere nach
              Land, Dauer und Tätigkeit, finde Plätze mit freier Kost und Unterkunft. Feste
              Karrierejobs sortieren wir für dich aus.
            </Text>
            <Group gap="md">
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
                styles={{ root: { borderColor: 'rgba(234,245,238,0.4)', color: '#eaf5ee' } }}
              >
                Gut zu wissen
              </Button>
            </Group>
            <Group gap={48} mt="md">
              <Stat wert={stellen.length || '—'} label="offene Stellen" />
              <Stat wert={laender || '—'} label="Länder" />
              <Stat wert={kostenlos || '—'} label="mit freier Kost & Logis" />
            </Group>
            <Text fz="xs" c="rgba(234,245,238,0.6)" fs="italic" mt={4}>
              Komorebi · 木漏れ日 – japanisch für das Sonnenlicht, das durch Blätter fällt.
            </Text>
          </Stack>
        </Container>
        <svg
          viewBox="0 0 1440 90"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ position: 'absolute', bottom: -1, left: 0, width: '100%', height: 70, display: 'block' }}
        >
          <path d="M0 90V44c180 34 420 40 720 8s540-34 720-2v40z" fill="var(--nz-cream)" />
        </svg>
      </Box>

      <Container size="lg" py={{ base: 40, md: 64 }}>
        <Stack gap="xs" mb="lg">
          <Text fw={600} c="wald.8" tt="uppercase" fz="sm" lts={1}>
            Worauf hast du Lust?
          </Text>
          <Title order={2} className="nz-display" fz={{ base: 26, md: 34 }}>
            Direkt zum Tätigkeitsfeld
          </Title>
        </Stack>
        <Group gap="sm">
          {SCHNELL_FELDER.map((f) => (
            <Button
              key={f}
              component={Link}
              to={`/finden?feld=${encodeURIComponent(f)}`}
              variant="light"
              radius="xl"
              styles={{
                root: {
                  backgroundColor: `var(--mantine-color-${feldFarbe(f)}-1)`,
                  color: `var(--mantine-color-${feldFarbe(f)}-9)`,
                },
              }}
            >
              {f}
            </Button>
          ))}
        </Group>

        {featured.length > 0 && (
          <>
            <Group justify="space-between" align="flex-end" mt={56} mb="lg">
              <Stack gap="xs">
                <Text fw={600} c="wald.8" tt="uppercase" fz="sm" lts={1}>
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

        <Box mt={72} p={{ base: 'lg', md: 40 }} className="nz-panel" style={{ borderRadius: 24 }}>
          <SimpleGrid cols={{ base: 1, md: 3 }} spacing={{ base: 'xl', md: 'xl' }}>
            <SchrittKarte
              icon={<IconWorldSearch size={26} />}
              titel="Alles an einem Ort"
              text="Wir sammeln ökologische Freiwilligendienste aus vielen Quellen und machen sie gemeinsam durchsuchbar – täglich automatisch aktualisiert."
            />
            <SchrittKarte
              icon={<IconSeeding size={26} />}
              titel="Nur passende Stellen"
              text="Feste Karrierejobs und kostenpflichtige Voluntourism-Angebote filtern wir aus – damit du echte Freiwilligen- und Feldplätze findest."
            />
            <SchrittKarte
              icon={<IconHeartHandshake size={26} />}
              titel="Direkt zur Quelle"
              text="Jede Stelle verlinkt zur Organisation. Du bewirbst dich dort – wir verdienen nichts daran, das hier ist nicht-kommerziell."
            />
          </SimpleGrid>
        </Box>
      </Container>
    </>
  );
}

function SchrittKarte({ icon, titel, text }: { icon: ReactNode; titel: string; text: string }) {
  return (
    <Stack gap="sm">
      <Box
        style={{
          width: 52,
          height: 52,
          borderRadius: 16,
          display: 'grid',
          placeItems: 'center',
          backgroundColor: 'var(--mantine-color-wald-1)',
          color: 'var(--mantine-color-wald-8)',
        }}
      >
        {icon}
      </Box>
      <Title order={3} fz="xl">
        {titel}
      </Title>
      <Text c="dimmed">{text}</Text>
    </Stack>
  );
}
