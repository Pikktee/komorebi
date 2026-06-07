import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
  Box,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconInfoCircle,
  IconBriefcase,
  IconArrowsExchange,
  IconWorld,
  IconCompass,
} from '@tabler/icons-react';
import { PLATTFORMEN, type PlattformKategorie } from '../lib/plattformen';
import { TippBox } from '../components/TippBox';
import type { CSSProperties } from 'react';

const KATEGORIEN: { key: PlattformKategorie; titel: string; text: string }[] = [
  {
    key: 'Stellenboerse',
    titel: 'Stellenbörsen & Praktika',
    text: 'Frei durchsuchbare Job- und Praktikumsbörsen für Naturschutz, Ökologie und Feldforschung. Oft bezahlt oder mit Stipendium – hier lohnt das direkte Stöbern.',
  },
  {
    key: 'Work-Exchange',
    titel: 'Mitarbeit gegen Kost & Unterkunft',
    text: 'Du arbeitest mit und bekommst dafür Unterkunft und Verpflegung. Oft eine Mitgliedschaft nötig.',
  },
  {
    key: 'Aggregator',
    titel: 'Vergleichsportale',
    text: 'Große Suchportale, die viele Anbieter bündeln – gut für einen breiten Überblick.',
  },
  {
    key: 'Anbieter',
    titel: 'Organisierte Programme',
    text: 'Betreute Naturschutz- und Forschungsprojekte. Meist kostenpflichtig, dafür rundum organisiert.',
  },
];

function getWatermarkIcon(kategorie: PlattformKategorie) {
  switch (kategorie) {
    case 'Stellenboerse':
      return IconBriefcase;
    case 'Work-Exchange':
      return IconArrowsExchange;
    case 'Aggregator':
      return IconWorld;
    case 'Anbieter':
      return IconCompass;
  }
}

function PlattformKarte({ name, url, beschreibung, hinweis, kostenlosMoeglich, kategorie }: (typeof PLATTFORMEN)[number]) {
  const WatermarkIcon = getWatermarkIcon(kategorie);
  const akzent = kostenlosMoeglich ? 'wald' : 'terra';

  const style = {
    height: '100%',
    borderColor: 'var(--nz-line)',
    textDecoration: 'none',
    display: 'flex',
    flexDirection: 'column',
    '--nz-accent': `var(--mantine-color-${akzent}-4)`,
  } as CSSProperties;

  return (
    <Card
      component="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      withBorder
      radius="lg"
      padding="md"
      className="nz-card nz-platform-card"
      style={style}
    >
      <Box className="nz-card__glow" aria-hidden="true" />
      <Box className="nz-card__watermark" aria-hidden="true">
        <WatermarkIcon size={72} stroke={1.0} />
      </Box>

      <Stack gap="xs" h="100%" justify="space-between" style={{ position: 'relative', zIndex: 1 }}>
        <Stack gap="xs">
          <Group justify="space-between" align="flex-start" wrap="nowrap" gap="sm">
            <Text fw={650} fz="md" c="var(--nz-ink)" style={{ lineHeight: 1.25 }}>
              {name}
            </Text>
            <Box className="nz-card__arrow" aria-hidden="true">
              <IconArrowUpRight size={14} />
            </Box>
          </Group>

          <Group gap={6} mt={-4}>
            <Badge
              variant="light"
              color={kostenlosMoeglich ? 'wald' : 'terra'}
              size="xs"
              radius="sm"
              className="nz-badge-soft"
              style={{ textTransform: 'none', fontWeight: 650 }}
            >
              {kostenlosMoeglich ? 'kostenlos möglich' : 'kostenpflichtig'}
            </Badge>
          </Group>

          <Text size="sm" c="dark.4" style={{ lineHeight: 1.4, marginTop: 4 }}>
            {beschreibung}
          </Text>
        </Stack>

        {hinweis && (
          <Group
            gap={6}
            p={8}
            mt="sm"
            style={{
              background: kostenlosMoeglich ? 'rgba(21, 107, 65, 0.04)' : 'rgba(219, 109, 48, 0.04)',
              border: `1px solid ${kostenlosMoeglich ? 'var(--mantine-color-wald-1)' : 'var(--mantine-color-terra-1)'}`,
              borderRadius: '8px',
            }}
            wrap="nowrap"
            align="flex-start"
          >
            <IconInfoCircle
              size={14}
              style={{
                color: kostenlosMoeglich ? 'var(--mantine-color-wald-6)' : 'var(--mantine-color-terra-6)',
                flexShrink: 0,
                marginTop: 2,
              }}
            />
            <Text size="xs" c="dark.3" style={{ lineHeight: 1.35 }}>
              {hinweis}
            </Text>
          </Group>
        )}
      </Stack>
    </Card>
  );
}

export function PlattformenPage() {
  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Stack gap="xs" mb="lg" maw={720}>
        <Title order={1} fz={{ base: 32, md: 40 }}>
          Weitere Plattformen
        </Title>
        <Text c="dimmed">
          Diese Portale lesen wir bewusst nicht automatisch aus – ihre AGB verbieten das oder die
          Angebote stehen nur hinter einer Anmeldung. Dafür verlinken wir sie hier direkt, damit du
          dort weitersuchen kannst.
        </Text>
      </Stack>

      <TippBox
        titel="Tipp: Kosten im Blick behalten"
        icon={<IconInfoCircle size={20} />}
        color="wald"
        mb="xl"
        takeaway="Achte überall auf den Unterschied zwischen freier Kost & Unterkunft und einer Teilnahmegebühr."
        points={[
          <><b>Freie Dienste:</b> Geförderte Dienste (wie ESC, weltwärts, IJFD) übernehmen deine Kosten vollständig oder weitgehend.</>,
          <><b>Kommerzielle Dienste:</b> Viele privat organisierte Programme verlangen hohe Gebühren von dir.</>
        ]}
      />

      <Stack gap={48}>
        {KATEGORIEN.map((kat) => (
          <div key={kat.key}>
            <Stack gap={2} mb="md">
              <Title order={2} fz={{ base: 24, md: 28 }}>
                {kat.titel}
              </Title>
              <Text c="dimmed" size="sm" maw={620}>
                {kat.text}
              </Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {PLATTFORMEN.filter((p) => p.kategorie === kat.key).map((p) => (
                <PlattformKarte key={p.name} {...p} />
              ))}
            </SimpleGrid>
          </div>
        ))}
      </Stack>
    </Container>
  );
}
