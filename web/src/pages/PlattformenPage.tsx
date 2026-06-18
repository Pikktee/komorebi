import { useState, useMemo } from 'react';
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
  TextInput,
  SegmentedControl,
  Button,
} from '@mantine/core';
import {
  IconArrowUpRight,
  IconInfoCircle,
  IconBriefcase,
  IconArrowsExchange,
  IconWorld,
  IconCompass,
  IconSearch,
  IconX,
} from '@tabler/icons-react';
import { PLATTFORMEN, type PlattformKategorie, type Plattform } from '../lib/plattformen';
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

function PlattformKarte({ name, url, beschreibung, hinweis, kostenlosMoeglich, kategorie }: Plattform) {
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
  const [suche, setSuche] = useState('');
  const [kategorie, setKategorie] = useState<string>('alle');
  const [gebuehr, setGebuehr] = useState<string>('alle');

  const gefiltert = useMemo(() => {
    return PLATTFORMEN.filter((p) => {
      if (suche.trim()) {
        const term = suche.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(term);
        const matchesDesc = p.beschreibung.toLowerCase().includes(term);
        const matchesHinweis = p.hinweis?.toLowerCase().includes(term) ?? false;
        if (!matchesName && !matchesDesc && !matchesHinweis) return false;
      }
      if (kategorie !== 'alle' && p.kategorie !== kategorie) return false;
      if (gebuehr === 'kostenlos' && !p.kostenlosMoeglich) return false;
      if (gebuehr === 'kostenpflichtig' && p.kostenlosMoeglich) return false;
      return true;
    });
  }, [suche, kategorie, gebuehr]);

  const matchesByKat = useMemo(() => {
    const map: Record<PlattformKategorie, Plattform[]> = {
      Stellenboerse: [],
      'Work-Exchange': [],
      Aggregator: [],
      Anbieter: [],
    };
    gefiltert.forEach((p) => {
      map[p.kategorie].push(p);
    });
    return map;
  }, [gefiltert]);

  const handleReset = () => {
    setSuche('');
    setKategorie('alle');
    setGebuehr('alle');
  };

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

      {/* Filterleiste */}
      <Card withBorder radius="lg" p="lg" mb="xl" className="nz-glass-panel" style={{ borderColor: 'var(--nz-line)' }}>
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          <TextInput
            placeholder="Name oder Stichwort suchen …"
            value={suche}
            onChange={(e) => setSuche(e.currentTarget.value)}
            label="Suchbegriff"
            leftSection={<IconSearch size={15} />}
            rightSection={suche && <IconX size={15} style={{ cursor: 'pointer' }} onClick={() => setSuche('')} />}
          />
          <Stack gap={3}>
            <Text size="sm" fw={500} c="dark.5">Kategorie</Text>
            <SegmentedControl
              value={kategorie}
              onChange={setKategorie}
              data={[
                { label: 'Alle', value: 'alle' },
                { label: 'Börsen', value: 'Stellenboerse' },
                { label: 'Exchange', value: 'Work-Exchange' },
                { label: 'Vergleiche', value: 'Aggregator' },
                { label: 'Anbieter', value: 'Anbieter' },
              ]}
              color="wald"
            />
          </Stack>
          <Stack gap={3}>
            <Text size="sm" fw={500} c="dark.5">Gebühren</Text>
            <SegmentedControl
              value={gebuehr}
              onChange={setGebuehr}
              data={[
                { label: 'Alle', value: 'alle' },
                { label: 'Kostenlos', value: 'kostenlos' },
                { label: 'Gebühren', value: 'kostenpflichtig' },
              ]}
              color="wald"
            />
          </Stack>
        </SimpleGrid>
      </Card>

      <Stack gap={48}>
        {KATEGORIEN.map((kat) => {
          const items = matchesByKat[kat.key] || [];
          if (items.length === 0) return null;
          return (
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
                {items.map((p) => (
                  <PlattformKarte key={p.name} {...p} />
                ))}
              </SimpleGrid>
            </div>
          );
        })}

        {gefiltert.length === 0 && (
          <Stack align="center" gap="md" py={64}>
            <Text fw={650} fz="lg">Keine Plattformen gefunden</Text>
            <Text c="dimmed" size="sm" ta="center" maw={420}>
              Mit diesen Filtereinstellungen wurden leider keine passenden Portale gefunden. Passe deine Filter oder deinen Suchbegriff an.
            </Text>
            <Button variant="light" color="terra" size="xs" onClick={handleReset}>
              Filter zurücksetzen
            </Button>
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
