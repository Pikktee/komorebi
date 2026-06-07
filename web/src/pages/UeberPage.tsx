import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  Anchor,
  Box,
  Card,
  Container,
  Group,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconSunHigh, IconLeaf } from '@tabler/icons-react';
import { KomorebiMark } from '../components/Logo';

const FAQ: { frage: string; antwort: ReactNode }[] = [
  {
    frage: 'Was macht Komorebi?',
    antwort: (
      <>
        Komorebi sammelt ökologische Freiwilligendienste, Praktika und Feldforschungs-Plätze aus
        vielen Quellen weltweit und macht sie an einem Ort durchsuchbar – nach Land, Dauer,
        Tätigkeit und Förderung. Plätze mit freier Kost & Unterkunft stehen im Vordergrund.
      </>
    ),
  },
  {
    frage: 'Für wen ist das gedacht?',
    antwort:
      'Für junge Menschen mit Interesse an Natur, Biologie und Umwelt – zum Beispiel vor oder ' +
      'neben dem Studium. Ursprünglich als persönliches Projekt für eine angehende Biologin gebaut.',
  },
  {
    frage: 'Woher kommen die Stellen?',
    antwort: (
      <>
        Täglich automatisch aus öffentlichen Quellen (u. a. Conservation Job Board und dem Texas A&M
        Natural Resources Job Board), ergänzt um einen kuratierten Grundbestand. Plattformen, die wir
        aus rechtlichen Gründen nicht automatisch auslesen dürfen, verlinken wir unter{' '}
        <Anchor component={Link} to="/plattformen">Weitere Plattformen</Anchor>.
      </>
    ),
  },
  {
    frage: 'Wie wird aussortiert, was nicht passt?',
    antwort:
      'Zweistufig: feste Regeln entfernen das Offensichtliche (Festanstellungen, Manager-Rollen), ' +
      'und ein günstiges KI-Modell prüft den Inhalt und wirft das Subtile raus – etwa getarnte ' +
      'Studiengänge, fachfremde Jobs oder kostenpflichtige Voluntourism-Angebote.',
  },
  {
    frage: 'Kostet das etwas? Verdient ihr daran?',
    antwort:
      'Nein. Komorebi ist nicht-kommerziell, ohne Werbung und ohne Vermittlungsgebühr. Du bewirbst ' +
      'dich immer direkt bei der jeweiligen Organisation – wir verdienen nichts daran.',
  },
  {
    frage: 'Wie wurde die App entwickelt?',
    antwort: (
      <>
        Als schlankes persönliches Projekt, gebaut in Zusammenarbeit mit <b>Claude</b> (KI) als
        Programmierhilfe. Technik: ein React-Frontend (Vite + Mantine), eine Python-Pipeline fürs
        Sammeln, Normalisieren und Filtern (inkl. KI-Stufe), tägliche Aktualisierung über GitHub
        Actions, gehostet auf GitHub Pages.
      </>
    ),
  },
  {
    frage: 'Sind die Angaben verbindlich?',
    antwort: (
      <>
        Nein, alle Angaben sind ohne Gewähr und können sich ändern. Verbindliche Informationen
        findest du immer direkt bei der Organisation. Hintergrund & Quellen erklären wir unter{' '}
        <Anchor component={Link} to="/wissen">Gut zu wissen</Anchor>.
      </>
    ),
  },
];

export function UeberPage() {
  return (
    <>
      <Box style={{ background: 'linear-gradient(180deg, var(--mantine-color-wald-0), transparent)' }}>
        <Container size="sm" pt={{ base: 'xl', md: 56 }} pb="md">
          <Stack gap="md" align="center" ta="center">
            <KomorebiMark size={48} />
            <Title order={1} className="nz-display" fz={{ base: 32, md: 44 }}>
              Über Komorebi
            </Title>
            <Text c="dimmed" maw={560} fz={{ base: 'md', md: 'lg' }}>
              Ein kleines, nicht-kommerzielles Projekt, das ökologische Freiwilligendienste weltweit
              an einem Ort durchsuchbar macht.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="sm" py={{ base: 'lg', md: 'xl' }}>
        <Stack gap={48}>
          {/* Der Name */}
          <Card withBorder radius="lg" padding="lg" style={{ borderColor: 'var(--nz-line)' }} className="nz-glass-panel">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" style={{ alignItems: 'center' }}>
              <Stack gap="xs">
                <Group gap="sm" mb={4}>
                  <ThemeIcon variant="light" color="sonne" radius="md" size="lg">
                    <IconSunHigh size={20} />
                  </ThemeIcon>
                  <Title order={2} fz="xl" className="nz-display">
                    Woher der Name?
                  </Title>
                </Group>
                <Text c="dark.5" size="sm" style={{ lineHeight: 1.5 }}>
                  <b>Komorebi</b> (japanisch 木漏れ日) bezeichnet das <b>Sonnenlicht, das durch die
                  Blätter der Bäume fällt</b> – ein eigenes Wort für diese Lichtflecken im Wald. Es steht
                  für genau die Momente draußen in der Natur, die solche Einsätze ausmachen.
                </Text>
              </Stack>
              <img
                src="/komorebi_forest.png"
                alt="Sonnenlicht durch Blätter"
                style={{
                  width: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid var(--nz-line)',
                  boxShadow: '0 6px 18px rgba(10, 42, 27, 0.1)',
                }}
              />
            </SimpleGrid>
          </Card>

          {/* FAQ */}
          <div>
            <Group gap="sm" mb="md">
              <ThemeIcon variant="light" color="wald" radius="md" size="lg">
                <IconLeaf size={20} />
              </ThemeIcon>
              <Title order={2} fz="xl" className="nz-display">
                Häufige Fragen
              </Title>
            </Group>
            <Accordion variant="separated" radius="md" defaultValue="Was macht Komorebi?">
              {FAQ.map((f) => (
                <Accordion.Item key={f.frage} value={f.frage}>
                  <Accordion.Control>
                    <Text fw={600}>{f.frage}</Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Text c="dimmed" size="sm">
                      {f.antwort}
                    </Text>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </Stack>
      </Container>
    </>
  );
}
