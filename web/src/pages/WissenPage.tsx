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
          <Anchor href={`#q${x}`} fz={11} fw={700} c="wald.7" aria-label={`Quelle ${x}`}>
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
    <Stack gap={6} mb="md">
      <Group gap={8} c="wald.8">
        <ThemeIcon variant="light" color="wald" radius="md" size="md">
          {icon}
        </ThemeIcon>
        <Text fw={600} tt="uppercase" fz="sm" lts={1}>
          {kicker}
        </Text>
      </Group>
      <Title order={2} className="nz-display" fz={{ base: 24, md: 30 }}>
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
        <Container size="md" pt={{ base: 'xl', md: 56 }} pb="md">
          <Stack gap="md" align="center" ta="center">
            <KomorebiMark size={48} />
            <Title order={1} className="nz-display" fz={{ base: 32, md: 44 }}>
              Gut zu wissen
            </Title>
            <Text c="dimmed" maw={620} fz={{ base: 'md', md: 'lg' }}>
              Was ökologische Freiwilligendienste sind, welche Programme es gibt, was sie
              übernehmen – und worauf du achten solltest. Kompakt erklärt, mit Quellen zum
              Weiterlesen.
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="md" py={{ base: 'lg', md: 'xl' }}>
        <Stack gap={56}>
          {/* In Kürze */}
          <section>
            <SectionTitle icon={<IconLeaf size={18} />} kicker="In Kürze" titel="Was ist ein ökologischer Freiwilligendienst?" />
            <Text mb="md">
              Ein ökologischer Freiwilligendienst ist ein organisierter Einsatz im Natur-,
              Arten- oder Umweltschutz – das deutsche <b>Freiwillige Ökologische Jahr (FÖJ)</b>{' '}
              ist das bekannteste Vorbild.<Ref n={6} /> Du arbeitest mehrere Monate in einem
              Projekt mit, wirst dabei begleitet und versichert und bekommst Taschengeld – aber
              kein reguläres Gehalt. Komorebi sammelt solche Plätze <b>weltweit</b> und macht sie
              gemeinsam durchsuchbar.<Ref n={7} />
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
              <KurzKarte icon={<IconLeaf size={22} />} titel="Was" text="Naturschutz, Artenschutz, Feldforschung & Umweltbildung – statt Schreibtisch." />
              <KurzKarte icon={<IconWorld size={22} />} titel="Für wen" text="Junge Menschen, die Natur erleben und sich orientieren wollen – ideal vor dem Studium." />
              <KurzKarte icon={<IconCoin size={22} />} titel="Was kostet's" text="Bei geförderten Diensten nichts – oft gibt es sogar Taschengeld und freie Kost & Logis." />
            </SimpleGrid>
          </section>

          {/* Programme */}
          <section>
            <SectionTitle icon={<IconWorld size={18} />} kicker="Förderung" titel="Die wichtigsten Programme" />
            <Text mb="lg">
              Viele Plätze laufen über staatlich oder von der EU geförderte Programme. Sie
              unterscheiden sich in Träger, Dauer, Alter und Zielregion – die Leistungen sind
              aber ähnlich: Der Platz ist für dich <b>kostenlos</b>.
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
              {PROGRAMME.map((p) => (
                <Card key={p.name} withBorder radius="lg" padding="lg" style={{ borderColor: 'var(--nz-line)' }}>
                  <Group justify="space-between" mb={6}>
                    <Text fw={700} fz="lg" className="nz-display">
                      {p.name}
                    </Text>
                    <Badge variant="light" color={p.farbe} radius="sm" style={{ textTransform: 'none' }}>
                      {p.traeger}
                    </Badge>
                  </Group>
                  <Text size="sm" c="dark.4" mb="sm">
                    {p.text}
                    <Ref n={p.ref} />
                  </Text>
                  <Divider mb="sm" />
                  <Group gap="lg">
                    <FactMini label="Dauer" wert={p.dauer} />
                    <FactMini label="Alter" wert={p.alter} />
                    <FactMini label="Region" wert={p.region} />
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          </section>

          {/* Leistungen */}
          <section>
            <SectionTitle icon={<IconShieldCheck size={18} />} kicker="Leistungen" titel="Was die Förderung übernimmt" />
            <Text mb="lg">
              Am Beispiel des Europäischen Solidaritätskorps: Die EU zahlt keinen Lohn, sondern
              macht den Platz <b>kostenlos</b> für dich.<Ref n={1} /> Bei IJFD, weltwärts und
              kulturweit ist es ähnlich.<Ref n={[3, 4, 5]} />
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {LEISTUNGEN.map((l) => (
                <Group key={l.titel} gap="sm" align="flex-start" wrap="nowrap">
                  <ThemeIcon variant="light" color="wald" radius="md" size="lg">
                    {l.icon}
                  </ThemeIcon>
                  <div>
                    <Text fw={600} size="sm">
                      {l.titel}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {l.text}
                    </Text>
                  </div>
                </Group>
              ))}
            </SimpleGrid>
          </section>

          {/* Voluntourism */}
          <section>
            <Card withBorder radius="lg" padding="lg" style={{ borderColor: 'var(--mantine-color-terra-2)', backgroundColor: 'var(--mantine-color-terra-0)' }}>
              <Group gap="sm" mb="xs">
                <ThemeIcon variant="light" color="terra" radius="md" size="lg">
                  <IconAlertTriangle size={20} />
                </ThemeIcon>
                <Title order={3} fz="xl">
                  Vorsicht: die Voluntourism-Falle
                </Title>
              </Group>
              <Text c="dark.5">
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
          </section>

          {/* Glossar */}
          <section>
            <SectionTitle icon={<IconBook2 size={18} />} kicker="Nachschlagen" titel="Glossar" />
            <Stack gap={0}>
              {GLOSSAR.map((g, i) => (
                <Box key={g.begriff} py="md" style={{ borderTop: i === 0 ? undefined : '1px solid var(--nz-line)' }}>
                  <Text fw={600} mb={2}>
                    {g.begriff}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {g.text}
                  </Text>
                </Box>
              ))}
            </Stack>
          </section>

          {/* Quellen */}
          <section id="quellen">
            <SectionTitle icon={<IconExternalLink size={18} />} kicker="Belege" titel="Quellen" />
            <Text size="sm" c="dimmed" mb="md">
              Alle Angaben sind sorgfältig recherchiert, aber ohne Gewähr – Details (Alter, Dauer,
              Leistungen) können sich ändern. Verbindliche Informationen findest du immer direkt
              bei den Programmen und Organisationen. Stand: Juni 2026.
            </Text>
            <Stack gap="xs">
              {QUELLEN.map((q) => (
                <Group key={q.n} id={`q${q.n}`} gap="xs" wrap="nowrap" align="flex-start">
                  <Text fw={700} c="wald.7" fz="sm" style={{ minWidth: 24 }}>
                    [{q.n}]
                  </Text>
                  <Anchor href={q.url} target="_blank" rel="noopener noreferrer" size="sm">
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
            <Button component={Link} to="/finden" size="md" color="wald" rightSection={<IconArrowRight size={18} />}>
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
    <Card withBorder radius="lg" padding="lg" style={{ borderColor: 'var(--nz-line)' }}>
      <ThemeIcon variant="light" color="wald" radius="md" size="lg" mb="sm">
        {icon}
      </ThemeIcon>
      <Text fw={600} mb={4}>
        {titel}
      </Text>
      <Text size="sm" c="dimmed">
        {text}
      </Text>
    </Card>
  );
}

function FactMini({ label, wert }: { label: string; wert: string }) {
  return (
    <div>
      <Text fz={11} c="dimmed" tt="uppercase" lts={0.5}>
        {label}
      </Text>
      <Text size="sm" fw={500}>
        {wert}
      </Text>
    </div>
  );
}
