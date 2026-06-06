import {
  Alert,
  Anchor,
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconArrowUpRight, IconInfoCircle } from '@tabler/icons-react';
import { PLATTFORMEN, type PlattformKategorie } from '../lib/plattformen';

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

function PlattformKarte({ name, url, beschreibung, hinweis, kostenlosMoeglich }: (typeof PLATTFORMEN)[number]) {
  return (
    <Card withBorder radius="lg" padding="lg" className="nz-card" style={{ borderColor: 'var(--nz-line)' }}>
      <Stack gap="xs" h="100%">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={600} fz="lg">
            {name}
          </Text>
          <Badge variant="light" color={kostenlosMoeglich ? 'wald' : 'terra'} radius="sm" style={{ textTransform: 'none' }}>
            {kostenlosMoeglich ? 'kostenlos möglich' : 'kostenpflichtig'}
          </Badge>
        </Group>
        <Text size="sm" c="dark.4">
          {beschreibung}
        </Text>
        {hinweis && (
          <Text size="xs" c="dimmed" fs="italic">
            {hinweis}
          </Text>
        )}
        <Anchor href={url} target="_blank" rel="noopener noreferrer" mt="auto" fw={600} c="wald.8">
          <Group gap={4}>
            <span>Öffnen</span>
            <IconArrowUpRight size={16} />
          </Group>
        </Anchor>
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

      <Alert color="wald" variant="light" icon={<IconInfoCircle />} mb="xl" radius="md">
        Tipp: Achte überall auf den Unterschied zwischen freier Kost &amp; Unterkunft und einer
        Teilnahmegebühr. Viele organisierte Programme sind kostenpflichtig.
      </Alert>

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
