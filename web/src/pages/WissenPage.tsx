import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconLeaf,
  IconWorld,
  IconCoin,
  IconHome,
  IconPlane,
  IconShieldCheck,
  IconLanguage,
  IconCalendarEvent,
  IconAlertTriangle,
  IconCircleCheck,
  IconBook2,
  IconArrowRight,
  IconExternalLink,
} from '@tabler/icons-react';
import { KomorebiMark } from '../components/Logo';

/** Quellenverzeichnis – jede Aussage im Text verweist hierauf (durchgehende Belege). */
const QUELLEN = [
  {
    n: 1,
    name: 'Europäisches Solidaritätskorps – European Youth Portal (EU-Kommission)',
    url: 'https://youth.europa.eu/solidarity_en',
  },
  {
    n: 2,
    name: 'JUGEND für Europa – Nationale Agentur für das Solidaritätskorps in Deutschland',
    url: 'https://www.jugendfuereuropa.de/',
  },
  {
    n: 3,
    name: 'Internationaler Jugendfreiwilligendienst (IJFD) – BMFSFJ',
    url: 'https://www.bmfsfj.de/bmfsfj/themen/engagement-und-gesellschaft/freiwilligendienste',
  },
  {
    n: 4,
    name: 'weltwärts – Bundesministerium für wirtschaftliche Zusammenarbeit und Entwicklung (BMZ)',
    url: 'https://www.weltwaerts.de/',
  },
  {
    n: 5,
    name: 'kulturweit – Freiwilligendienst der Deutschen UNESCO-Kommission / Auswärtiges Amt',
    url: 'https://www.kulturweit.de/',
  },
  {
    n: 6,
    name: 'Freiwilliges Ökologisches Jahr (FÖJ) – Bundesarbeitskreis FÖJ',
    url: 'https://foej.de/',
  },
  {
    n: 7,
    name: 'Wege ins Ausland – AKLHÜ e. V. (Arbeitskreis Lernen und Helfen in Übersee)',
    url: 'https://www.wege-ins-ausland.org/',
  },
];

/** Hochgestellter Quellenverweis [n], der zum Eintrag im Quellenverzeichnis springt. */
function Ref({ n }: { n: number | number[] }) {
  const liste = Array.isArray(n) ? n : [n];
  return (
    <sup style={{ whiteSpace: 'nowrap' }}>
      {liste.map((x, i) => (
        <span key={x}>
          {i > 0 && ','}
          <Anchor href={`#q${x}`} fz={11} fw={700} c="wald.9" aria-label={`Quelle ${x}`}>
            [{x}]
          </Anchor>
        </span>
      ))}
    </sup>
  );
}

interface Programm {
  name: string;
  traeger: string;
  dauer: string;
  alter: string;
  region: string;
  text: string;
  ref: number[];
  farbe: string;
}

const PROGRAMME: Programm[] = [
  {
    name: 'ESC',
    traeger: 'EU-Kommission',
    dauer: 'i. d. R. 2–12 Monate',
    alter: '18–30 Jahre',
    region: 'Europa & Partnerländer',
    text: 'Europäisches Solidaritätskorps: Die EU finanziert deinen Platz – Reise, Unterkunft, Verpflegung, Versicherung, Sprachunterstützung und Taschengeld. Für dich kostenlos.',
    ref: [1, 2],
    farbe: 'wald',
  },
  {
    name: 'IJFD',
    traeger: 'BMFSFJ',
    dauer: '6–18 Monate (meist 12)',
    alter: 'ab 16 bis 26 Jahre',
    region: 'weltweit',
    text: 'Internationaler Jugendfreiwilligendienst: staatlich gefördert, mit Unterkunft, Verpflegung, Taschengeld und pädagogischer Begleitung samt Seminaren.',
    ref: [3],
    farbe: 'himmel',
  },
  {
    name: 'weltwärts',
    traeger: 'BMZ',
    dauer: '6–24 Monate (meist 12)',
    alter: '18–28 Jahre',
    region: 'Globaler Süden',
    text: 'Entwicklungspolitischer Freiwilligendienst. Die Kosten werden weitgehend übernommen; viele Freiwillige werben zusätzlich einen Förderkreis aus Spenden ein.',
    ref: [4],
    farbe: 'terra',
  },
  {
    name: 'kulturweit',
    traeger: 'Auswärtiges Amt / DUK',
    dauer: '6 oder 12 Monate',
    alter: '18–26 Jahre',
    region: 'weltweit',
    text: 'Freiwilligendienst in Kultur, Bildung, Wissenschaft und Nachhaltigkeit – getragen von der Deutschen UNESCO-Kommission, gefördert vom Auswärtigen Amt.',
    ref: [5],
    farbe: 'grape',
  },
];

const LEISTUNGEN: { icon: ReactNode; titel: string; text: string }[] = [
  { icon: <IconHome size={20} />, titel: 'Unterkunft & Verpflegung', text: 'Wohnen und Essen werden vor Ort gestellt.' },
  { icon: <IconCoin size={20} />, titel: 'Taschengeld', text: 'Ein monatlicher Betrag für deine persönlichen Ausgaben.' },
  { icon: <IconPlane size={20} />, titel: 'Reisekosten', text: 'An- und Abreise werden (anteilig) erstattet.' },
  { icon: <IconShieldCheck size={20} />, titel: 'Versicherung', text: 'Kranken-, Unfall- und Haftpflichtschutz für den Einsatz.' },
  { icon: <IconLanguage size={20} />, titel: 'Sprache & Seminare', text: 'Sprachkurs sowie Vorbereitungs- und Begleitseminare.' },
  { icon: <IconCalendarEvent size={20} />, titel: 'Begleitung', text: 'Feste Ansprechpersonen in Entsende- und Aufnahmeorganisation.' },
];

const GLOSSAR: { begriff: string; text: ReactNode }[] = [
  {
    begriff: 'Freiwilligendienst',
    text: 'Ein organisierter, meist mehrmonatiger Einsatz für das Gemeinwohl – mit Begleitung, Versicherung und Taschengeld, aber ohne reguläres Gehalt.',
  },
  {
    begriff: 'FÖJ – Freiwilliges Ökologisches Jahr',
    text: <>Jugendfreiwilligendienst im Natur- und Umweltschutz, in der Regel 12 Monate, für junge Menschen etwa zwischen 16 und 27 Jahren. Vorbild dieser App.<Ref n={6} /></>,
  },
  {
    begriff: 'ESC – Europäisches Solidaritätskorps',
    text: <>EU-Programm, das Freiwilligeneinsätze in Europa und Partnerländern finanziert (Reise, Kost & Logis, Versicherung, Taschengeld).<Ref n={1} /></>,
  },
  {
    begriff: 'Aufnahmeorganisation',
    text: 'Die Einrichtung vor Ort (z. B. ein Nationalpark oder eine Forschungsstation), bei der du tatsächlich mitarbeitest.',
  },
  {
    begriff: 'Entsendeorganisation',
    text: 'Die Organisation in deinem Heimatland, die dich vorbereitet, vermittelt und während des Dienstes begleitet.',
  },
  {
    begriff: 'Taschengeld',
    text: 'Ein kleiner monatlicher Betrag für persönliche Ausgaben – kein Lohn, sondern Teil der Förderung.',
  },
  {
    begriff: 'Feldassistenz / Feldforschung',
    text: 'Mitarbeit bei wissenschaftlicher Datenerhebung in der Natur – z. B. Tiere zählen, Proben nehmen, Lebensräume kartieren.',
  },
  {
    begriff: 'Workcamp',
    text: 'Kurzer (oft 1–3 Wochen) Gruppeneinsatz, häufig im Natur- oder Denkmalschutz, meist mit geringen Kosten und einfacher Unterkunft.',
  },
  {
    begriff: 'Voluntourism',
    text: <>Mischung aus „volunteering" und „tourism": kommerzielle Freiwilligenreisen, oft mit hoher Teilnahmegebühr. Wirkung und Sinn solltest du kritisch prüfen.<Ref n={7} /></>,
  },
  {
    begriff: 'Kost & Unterkunft frei',
    text: 'Verpflegung und Wohnen werden ohne Kosten für dich gestellt – das wichtigste Filterkriterium in dieser App.',
  },
];

function SectionTitle({ icon, kicker, titel }: { icon: ReactNode; kicker: string; titel: string }) {
  return (
    <Stack gap={6} mb="lg">
      <Group gap={8} c="wald.8">
        <ThemeIcon variant="light" color="wald" radius="md" size="md">
          {icon}
        </ThemeIcon>
        <Text fw={700} tt="uppercase" fz="xs" lts={1.5}>
          {kicker}
        </Text>
      </Group>
      <Title order={2} className="nz-display" fz={{ base: 26, md: 32 }} c="wald.9">
        {titel}
      </Title>
    </Stack>
  );
}

export function WissenPage() {
  return (
    <>
      {/* Kopfband */}
      <Box style={{ background: 'linear-gradient(180deg, var(--mantine-color-wald-0), transparent)' }}>
        <Container size="md" pt={{ base: 'xl', md: 64 }} pb="xl">
          <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl" style={{ alignItems: 'center' }}>
            <Stack gap="md" className="nz-wissen-header-stack">
              <KomorebiMark size={48} />
              <Title order={1} className="nz-display" fz={{ base: 34, md: 46 }} c="wald.9">
                Gut zu wissen
              </Title>
              <Text c="dimmed" fz={{ base: 'sm', md: 'md' }} style={{ lineHeight: 1.5 }}>
                Was ökologische Freiwilligendienste sind, welche Programme es gibt, was sie
                übernehmen – und worauf du achten solltest. Kompakt erklärt, mit Belegen zum
                Weiterlesen.
              </Text>
            </Stack>
            <Box style={{ position: 'relative', width: '100%', maxWidth: 360, margin: '0 auto' }}>
              <Box
                style={{
                  position: 'absolute',
                  inset: 6,
                  borderRadius: 16,
                  backgroundColor: 'var(--mantine-color-sonne-2)',
                  transform: 'rotate(2deg)',
                  zIndex: 0,
                }}
              />
              <img
                src="/komorebi_forest.png"
                alt="Sonnenlicht fällt durch Blätter"
                style={{
                  width: '100%',
                  height: 200,
                  objectFit: 'cover',
                  borderRadius: 14,
                  border: '1px solid var(--nz-line)',
                  boxShadow: '0 8px 24px rgba(10, 42, 27, 0.15)',
                  position: 'relative',
                  zIndex: 1,
                  display: 'block',
                }}
              />
            </Box>
          </SimpleGrid>
        </Container>
      </Box>

      <Container size="md" py={{ base: 'lg', md: 'xl' }}>
        <Stack gap={64}>
          {/* In Kürze */}
          <section>
            <SectionTitle icon={<IconLeaf size={18} />} kicker="In Kürze" titel="Was ist ein ökologischer Freiwilligendienst?" />
            <Text mb="lg" style={{ lineHeight: 1.6 }}>
              Ein ökologischer Freiwilligendienst ist ein organisierter Einsatz im Natur-,
              Arten- oder Umweltschutz – das deutsche <b>Freiwillige Ökologische Jahr (FÖJ)</b>{' '}
              ist das bekannteste Vorbild.<Ref n={6} /> Du arbeitest mehrere Monate in einem
              Projekt mit, wirst dabei begleitet und versichert und bekommst Taschengeld – aber
              kein reguläres Gehalt. Komorebi sammelt solche Plätze <b>weltweit</b> und macht sie
              gemeinsam durchsuchbar.<Ref n={7} />
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
              <KurzKarte icon={<IconLeaf size={22} />} titel="Was" text="Naturschutz, Artenschutz, Feldforschung & Umweltbildung – statt Schreibtisch." />
              <KurzKarte icon={<IconWorld size={22} />} titel="Für wen" text="Junge Menschen, die Natur erleben und sich orientieren wollen – ideal vor dem Studium." />
              <KurzKarte icon={<IconCoin size={22} />} titel="Was kostet's" text="Bei geförderten Diensten nichts – oft gibt es sogar Taschengeld und freie Kost & Logis." />
            </SimpleGrid>
          </section>

          {/* Programme */}
          <section>
            <SectionTitle icon={<IconWorld size={18} />} kicker="Förderung" titel="Die wichtigsten Programme" />
            <Text mb="xl" style={{ lineHeight: 1.6 }}>
              Viele Plätze laufen über staatlich oder von der EU geförderte Programme. Sie
              unterscheiden sich in Träger, Dauer, Alter und Zielregion – die Leistungen sind
              aber ähnlich: Der Platz ist für dich <b>kostenlos</b>.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {PROGRAMME.map((p) => (
                <Card 
                  key={p.name} 
                  withBorder 
                  radius="lg" 
                  padding="lg" 
                  className="nz-glass-panel"
                  style={{ 
                    borderColor: 'var(--nz-line)',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <Box
                    style={{
                      position: 'absolute',
                      top: -30,
                      right: -30,
                      width: 130,
                      height: 130,
                      borderRadius: 999,
                      background: `radial-gradient(circle, var(--mantine-color-${p.farbe}-2) 0%, transparent 70%)`,
                      opacity: 0.65,
                      zIndex: 0,
                      pointerEvents: 'none',
                    }}
                  />
                  <Stack gap="sm" style={{ position: 'relative', zIndex: 1 }}>
                    <Group justify="space-between" mb={2} wrap="nowrap">
                      <Text fw={700} fz="lg" className="nz-display" c="wald.9">
                        {p.name}
                      </Text>
                      <Badge variant="light" color={p.farbe} radius="sm" style={{ textTransform: 'none', fontWeight: 700, border: `1px solid var(--mantine-color-${p.farbe}-2)` }}>
                        {p.traeger}
                      </Badge>
                    </Group>
                    <Text size="xs" c="dark.5" mb="xs" style={{ lineHeight: 1.45 }}>
                      {p.text}
                      <Ref n={p.ref} />
                    </Text>
                    <Divider />
                    <Group gap="md" wrap="wrap" pt={4}>
                      <FactMini label="Dauer" wert={p.dauer} />
                      <FactMini label="Alter" wert={p.alter} />
                      <FactMini label="Region" wert={p.region} />
                    </Group>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </section>

          {/* Leistungen */}
          <section>
            <SectionTitle icon={<IconShieldCheck size={18} />} kicker="Leistungen" titel="Was die Förderung übernimmt" />
            <Text mb="xl" style={{ lineHeight: 1.6 }}>
              Am Beispiel des Europäischen Solidaritätskorps: Die EU zahlt keinen Lohn, sondern
              macht den Platz <b>kostenlos</b> für dich.<Ref n={1} /> Bei IJFD, weltwärts und
              kulturweit ist es ähnlich.<Ref n={[3, 4, 5]} />
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
              {LEISTUNGEN.map((l) => (
                <Card key={l.titel} withBorder radius="md" p="md" className="nz-glass-panel" style={{ borderColor: 'var(--nz-line)' }}>
                  <Group gap="sm" align="flex-start" wrap="nowrap">
                    <ThemeIcon variant="light" color="wald" radius="md" size="lg" style={{ flexShrink: 0 }}>
                      {l.icon}
                    </ThemeIcon>
                    <div>
                      <Text fw={700} size="sm" c="wald.9">
                        {l.titel}
                      </Text>
                      <Text size="xs" c="dimmed" mt={2} style={{ lineHeight: 1.35 }}>
                        {l.text}
                      </Text>
                    </div>
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </section>

          {/* Voluntourism */}
          <section>
            <Card 
              withBorder 
              radius="lg" 
              padding="lg" 
              style={{ 
                borderColor: 'var(--mantine-color-terra-3)', 
                backgroundColor: 'var(--mantine-color-terra-0)' 
              }}
            >
              <Group gap="sm" mb="xs">
                <ThemeIcon variant="light" color="terra" radius="md" size="lg">
                  <IconAlertTriangle size={20} />
                </ThemeIcon>
                <Title order={3} fz="xl" className="nz-display" c="terra.9">
                  Vorsicht: die Voluntourism-Falle
                </Title>
              </Group>
              <Text size="xs" c="dark.5" style={{ lineHeight: 1.5 }}>
                Viele weltweite „Conservation"-Programme sind <b>kostenpflichtig</b> – teils mehrere
                tausend Euro. Solche kommerziellen Freiwilligenreisen („Voluntourism") halten nicht
                immer, was sie versprechen, und sind nicht automatisch sinnvoll für Natur oder
                Gemeinschaft.<Ref n={7} /> Komorebi blendet kostenpflichtige Angebote{' '}
                <b>standardmäßig aus</b> und stellt freie Kost & Unterkunft in den Vordergrund.
              </Text>
            </Card>
          </section>

          {/* Checkliste */}
          <section>
            <SectionTitle icon={<IconCircleCheck size={18} />} kicker="Orientierung" titel="Deine Checkliste" />
            <Card withBorder radius="lg" p="lg" className="nz-glass-panel" style={{ borderColor: 'var(--nz-line)' }}>
              <List
                spacing="sm"
                center
                icon={
                  <ThemeIcon color="wald" radius="xl" size={22}>
                    <IconCircleCheck size={14} />
                  </ThemeIcon>
                }
              >
                <List.Item>Ist der Platz <b>gefördert</b> oder fällt eine Teilnahmegebühr an? Was genau ist enthalten?</List.Item>
                <List.Item>Gibt es <b>freie Kost & Unterkunft</b> und ein Taschengeld?</List.Item>
                <List.Item>Wer ist die <b>Organisation</b> – seriös, transparent, mit echten Ansprechpersonen?</List.Item>
                <List.Item>Passt die <b>Dauer</b> (Wochen, Monate, ein ganzes Jahr) zu deinen Plänen?</List.Item>
                <List.Item>Welche <b>Voraussetzungen</b> gelten (Alter, Sprache, Vorkenntnisse, Impfungen)?</List.Item>
                <List.Item>Bis wann musst du dich <b>bewerben</b> – und brauchst du eine Entsendeorganisation?<Ref n={7} /></List.Item>
              </List>
            </Card>
          </section>

          {/* Glossar */}
          <section>
            <SectionTitle icon={<IconBook2 size={18} />} kicker="Nachschlagen" titel="Glossar" />
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              {GLOSSAR.map((g) => (
                <Card key={g.begriff} withBorder radius="lg" p="md" className="nz-glass-panel" style={{ borderColor: 'var(--nz-line)' }}>
                  <Text fw={700} mb={4} c="wald.9" className="nz-display" fz="sm">
                    {g.begriff}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
                    {g.text}
                  </Text>
                </Card>
              ))}
            </SimpleGrid>
          </section>

          {/* Quellen */}
          <section id="quellen">
            <SectionTitle icon={<IconExternalLink size={18} />} kicker="Belege" titel="Quellen" />
            <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.45 }}>
              Alle Angaben sind sorgfältig recherchiert, aber ohne Gewähr – Details (Alter, Dauer,
              Leistungen) können sich ändern. Verbindliche Informationen findest du immer direkt
              bei den Programmen und Organisationen. Stand: Juni 2026.
            </Text>
            <Stack gap="xs">
              {QUELLEN.map((q) => (
                <Group key={q.n} id={`q${q.n}`} gap="xs" wrap="nowrap" align="flex-start">
                  <Text fw={700} c="wald.9" fz="sm" style={{ minWidth: 24 }}>
                    [{q.n}]
                  </Text>
                  <Anchor href={q.url} target="_blank" rel="noopener noreferrer" size="sm" className="nz-link-high-contrast">
                    <Group gap={4} wrap="nowrap">
                      <span>{q.name}</span>
                      <IconExternalLink size={13} style={{ flexShrink: 0 }} />
                    </Group>
                  </Anchor>
                </Group>
              ))}
            </Stack>
          </section>

          {/* CTA */}
          <Box ta="center" py="md">
            <Button component={Link} to="/finden" size="md" color="wald" rightSection={<IconArrowRight size={18} />} style={{ fontWeight: 700 }}>
              Jetzt Stellen finden
            </Button>
          </Box>
        </Stack>
      </Container>
    </>
  );
}

function KurzKarte({ icon, titel, text }: { icon: ReactNode; titel: string; text: string }) {
  return (
    <Card 
      withBorder 
      radius="lg" 
      padding="lg" 
      className="nz-glass-panel"
      style={{ 
        borderColor: 'var(--nz-line)',
        boxShadow: '0 8px 20px -6px rgba(20, 35, 27, 0.04)',
      }}
    >
      <ThemeIcon variant="light" color="wald" radius="md" size="lg" mb="sm">
        {icon}
      </ThemeIcon>
      <Text fw={700} mb={4} c="wald.9" className="nz-display" fz="md">
        {titel}
      </Text>
      <Text size="xs" c="dimmed" style={{ lineHeight: 1.4 }}>
        {text}
      </Text>
    </Card>
  );
}

function FactMini({ label, wert }: { label: string; wert: string }) {
  return (
    <div>
      <Text fz={9} c="dimmed" tt="uppercase" lts={0.5} fw={700}>
        {label}
      </Text>
      <Text size="xs" fw={600} c="dark.4">
        {wert}
      </Text>
    </div>
  );
}
