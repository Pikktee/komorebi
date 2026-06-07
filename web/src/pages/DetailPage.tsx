import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Anchor,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Flex,
  Group,
  List,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowUpRight,
  IconCalendar,
  IconCalendarPlus,
  IconClock,
  IconExternalLink,
  IconLink,
  IconMapPin,
  IconWallet,
  IconCircleCheck,
  IconCoins,
} from '@tabler/icons-react';
import { useStellen } from '../lib/useStellen';
import { dauerText, datumText, PROGRAMM_LABEL, PROGRAMM_TOOLTIP, quelleLabel } from '../lib/labels';
import { TaetigkeitsPills, feldFarbe } from '../components/TaetigkeitsPills';
import { LeistungsBadges, leistungsListe } from '../components/LeistungsBadges';
import { InfoTooltip } from '../components/InfoTooltip';
import { ProgramPopover } from '../components/ProgramPopover';
import { TippBox } from '../components/TippBox';
import type { CSSProperties } from 'react';

function FactRow({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Group gap="sm" wrap="nowrap" align="flex-start">
      <Box c="wald.9" mt={2}>
        {icon}
      </Box>
      <div>
        <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
          {label}
        </Text>
        <Text fw={500}>{value}</Text>
      </div>
    </Group>
  );
}

function DetailFact({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) {
  return (
    <Group gap="sm" wrap="nowrap" align="flex-start" className="nz-detail-fact">
      <Box className="nz-detail-fact__icon" aria-hidden="true">
        {icon}
      </Box>
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" lts={0.5} fw={700}>
          {label}
        </Text>
        <Text fw={650}>{value}</Text>
      </Stack>
    </Group>
  );
}

function ortText(land: string, region: string | null): string {
  if (land) return `${land}${region ? ` · ${region}` : ''}`;
  if (region) return region;
  return 'Ort offen';
}

function kostenKurz(stelle: { kostenpflichtig: boolean; teilnahmegebuehr_eur: number | null; kost_unterkunft_frei: boolean }) {
  if (stelle.kostenpflichtig) {
    return stelle.teilnahmegebuehr_eur != null
      ? `Gebühr ${stelle.teilnahmegebuehr_eur.toLocaleString('de-DE')} €`
      : 'Kostenpflichtig';
  }
  if (stelle.kost_unterkunft_frei) return 'Kost & Unterkunft frei';
  return 'Keine Gebühr markiert';
}

function hostAusUrl(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

export function DetailPage() {
  const { id } = useParams();
  const { stellen, loading } = useStellen();
  const stelle = stellen.find((s) => s.id === id);

  if (loading) {
    return (
      <Container size="md" py="xl">
        <Text c="dimmed">Lade …</Text>
      </Container>
    );
  }

  if (!stelle) {
    return (
      <Container size="md" py={80}>
        <Stack align="center" gap="md">
          <Title order={2}>Stelle nicht gefunden</Title>
          <Text c="dimmed">Vielleicht ist sie nicht mehr aktuell. Schau dir die anderen Plätze an.</Text>
          <Button component={Link} to="/finden" color="wald">
            Zur Suche
          </Button>
        </Stack>
      </Container>
    );
  }

  const v = stelle.voraussetzungen;
  const alter =
    v.mindestalter != null && v.hoechstalter != null
      ? `${v.mindestalter}–${v.hoechstalter} Jahre`
      : v.mindestalter != null
        ? `ab ${v.mindestalter} Jahren`
        : v.hoechstalter != null
          ? `bis ${v.hoechstalter} Jahre`
          : null;

  const zeitraum =
    stelle.flexibler_start && !stelle.zeitraum_bis
      ? 'Flexibler Start'
      : [datumText(stelle.zeitraum_von), datumText(stelle.zeitraum_bis)].filter(Boolean).join(' – ') || null;

  const alleLinks = [stelle.quell_url, ...stelle.weitere_quell_urls].filter(Boolean);
  const leistungen = leistungsListe(stelle);
  const hinzugefuegt = datumText(stelle.erstmals_gesehen);
  const quellenText = `${alleLinks.length} ${alleLinks.length === 1 ? 'Quelle' : 'Quellen'}`;

  return (
    <Container size="lg" py={{ base: 'lg', md: 'xl' }}>
      <Button
        component={Link}
        to="/finden"
        variant="subtle"
        color="wald"
        leftSection={<IconArrowLeft size={16} />}
        mb="lg"
        px={6}
      >
        Zurück zur Suche
      </Button>

      <Flex direction={{ base: 'column', md: 'row' }} gap={{ base: 'lg', md: 48 }} align="flex-start">
        <Box style={{ flex: 1, minWidth: 0, width: '100%' }}>
          <Stack gap="md">
            <Group gap="sm">
              <ProgramPopover programm={stelle.programm}>
                <Badge
                  variant={stelle.programm === 'keins' ? 'light' : 'filled'}
                  color={stelle.programm === 'keins' ? 'gray' : 'himmel'}
                  radius="sm"
                  style={{ textTransform: 'none', cursor: 'pointer' }}
                >
                  {PROGRAMM_LABEL[stelle.programm]}
                </Badge>
              </ProgramPopover>
              
              <Group gap={4}>
                <IconMapPin size={16} style={{ color: 'var(--mantine-color-wald-6)', flexShrink: 0 }} />
                <Text fw={600}>
                  {ortText(stelle.land, stelle.region)}
                </Text>
                {stelle.kontinent && <Text c="dimmed">({stelle.kontinent})</Text>}
              </Group>
            </Group>

            <Title order={1} fz={{ base: 30, md: 40 }} lh={1.1} className="nz-display">
              {stelle.titel}
            </Title>
            <Text size="lg" c="dimmed" fw={500}>
              {stelle.organisation}
            </Text>

            <TaetigkeitsPills felder={stelle.taetigkeitsfeld} />

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" className="nz-detail-facts">
              <DetailFact
                icon={<IconMapPin size={18} />}
                label="Ort"
                value={`${ortText(stelle.land, stelle.region)}${stelle.kontinent ? ` (${stelle.kontinent})` : ''}`}
              />
              <DetailFact
                icon={<IconClock size={18} />}
                label="Dauer"
                value={dauerText(stelle.dauer_monate_min, stelle.dauer_monate_max)}
              />
              <DetailFact
                icon={<IconCalendar size={18} />}
                label="Bewerbungsfrist"
                value={datumText(stelle.bewerbungsfrist) ?? 'Keine Frist genannt'}
              />
              <DetailFact
                icon={<IconWallet size={18} />}
                label="Kosten & Leistungen"
                value={kostenKurz(stelle)}
              />
              <DetailFact
                icon={<IconCalendarPlus size={18} />}
                label="Hinzugefügt"
                value={hinzugefuegt ?? 'Datum unbekannt'}
              />
              <DetailFact icon={<IconLink size={18} />} label="Quellen" value={quellenText} />
            </SimpleGrid>

            <Text fz="md" lh={1.7} mt="xs" style={{ whiteSpace: 'pre-line' }}>
              {stelle.beschreibung}
            </Text>

            {leistungen.length > 0 && (
              <>
                <Divider my="md" />
                <Stack gap="xs">
                  <Title order={3} fz="xl" className="nz-display">
                    Leistungen im Detail
                  </Title>
                  <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {leistungen.map((l, idx) => (
                      <Card key={idx} withBorder radius="lg" p="md" className="nz-glass-panel" style={{ borderColor: 'var(--nz-line)' }}>
                        <Group gap="md" wrap="nowrap" align="flex-start">
                          <ThemeIcon size={40} radius="md" color={l.color} variant="light" style={{ flexShrink: 0 }}>
                            {l.icon}
                          </ThemeIcon>
                          <div>
                            <Text fw={700} size="sm">{l.text}</Text>
                            <Text size="xs" c="dimmed" mt={2} style={{ lineHeight: 1.35 }}>{l.tip}</Text>
                          </div>
                        </Group>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Stack>
              </>
            )}

            <Divider my="md" />

            <Title order={3} fz="xl" className="nz-display">
              Voraussetzungen
            </Title>
            <List spacing="xs" center icon={
              <ThemeIcon color="wald" size={20} radius="xl">
                <IconCircleCheck size={12} />
              </ThemeIcon>
            }>
              {alter && <List.Item>Alter: {alter}</List.Item>}
              {v.sprache && <List.Item>Sprache: {v.sprache}</List.Item>}
              {v.vorkenntnisse && <List.Item>{v.vorkenntnisse}</List.Item>}
              {!alter && !v.sprache && !v.vorkenntnisse && (
                <List.Item>Keine besonderen Voraussetzungen angegeben.</List.Item>
              )}
            </List>

            <Box
              mt="sm"
              p="md"
              className="nz-program-note"
              style={{
                borderRadius: 12,
              }}
            >
              <Group gap={6} justify="space-between">
                <Group gap={6}>
                  <Text fw={650}>Förderung & Programm</Text>
                  <InfoTooltip label={PROGRAMM_TOOLTIP[stelle.programm]} />
                </Group>
                <ProgramPopover programm={stelle.programm}>
                  <Badge
                    variant={stelle.programm === 'keins' ? 'light' : 'filled'}
                    color={stelle.programm === 'keins' ? 'gray' : 'himmel'}
                    radius="sm"
                    style={{ textTransform: 'none', cursor: 'pointer' }}
                  >
                    {PROGRAMM_LABEL[stelle.programm]}
                  </Badge>
                </ProgramPopover>
              </Group>
            </Box>

            {(stelle.programm === 'weltwärts' || (stelle.programm === 'IJFD' && Array.isArray(leistungen) && leistungen.length > 0)) && (
              <TippBox
                titel="Gut zu wissen: Der Spenderkreis"
                icon={<IconCoins size={20} />}
                color="terra"
                mt="md"
                takeaway="Der Spenderkreis ist keine feste Gebühr, die du selbst zahlen musst."
                points={[
                  <><b>Förderung &amp; Spenden:</b> Bei weltwärts (und manchen IJFD-Trägern) werden bis zu 75% der Kosten vom Bund gefördert. Die restlichen Kosten decken die Träger über Spenden ab.</>,
                  <><b>Deine Rolle:</b> Du wirst nach Zusage gebeten, Unterstützer (z.B. Verwandte, Vereinen, Firmen) zu suchen, die kleine Beiträge spenden.</>,
                  <><b>Keine Sorge:</b> Deine Zusage scheitert fast nie am Spenderkreis! Die Träger unterstützen dich intensiv dabei.</>
                ]}
              />
            )}
          </Stack>
        </Box>

        <Box w={{ base: '100%', md: 360 }} style={{ flexShrink: 0 }}>
          <Card
            withBorder
            radius="md"
            padding="lg"
            pt="xl"
            className="nz-accent nz-detail-aside"
            style={{
              position: 'sticky',
              top: 84,
              borderColor: 'var(--nz-line)',
              '--nz-accent': `var(--mantine-color-${feldFarbe(stelle.taetigkeitsfeld[0] ?? 'Sonstiges')}-5)`,
            } as CSSProperties}
          >
            <Stack gap="lg">
              <Text fw={700} fz="lg" className="nz-display">
                Auf einen Blick
              </Text>

              <FactRow
                icon={<IconClock size={18} />}
                label="Dauer"
                value={dauerText(stelle.dauer_monate_min, stelle.dauer_monate_max)}
              />
              {zeitraum && (
                <FactRow icon={<IconCalendar size={18} />} label="Zeitraum" value={zeitraum} />
              )}
              {stelle.bewerbungsfrist && (
                <FactRow
                  icon={<IconCalendar size={18} />}
                  label="Bewerbungsfrist"
                  value={datumText(stelle.bewerbungsfrist)}
                />
              )}

              {leistungen.length > 0 && (
                <>
                  <Divider />
                  <div>
                    <Text size="xs" c="dimmed" tt="uppercase" lts={0.5} mb={8}>
                      Leistungen
                    </Text>
                    <LeistungsBadges stelle={stelle} />
                  </div>
                </>
              )}

              <Divider />

              <Stack gap={6}>
                <Text size="xs" c="dimmed" tt="uppercase" lts={0.5}>
                  Quelle
                </Text>
                {alleLinks.map((url) => (
                  <Anchor key={url} href={url} target="_blank" rel="noopener noreferrer" size="sm">
                    <Group gap={4} wrap="nowrap">
                      <IconExternalLink size={14} />
                      <span style={{ wordBreak: 'break-all' }}>{url === stelle.quell_url ? quelleLabel(stelle.quelle) : hostAusUrl(url)}</span>
                    </Group>
                  </Anchor>
                ))}
              </Stack>

              <Button
                component="a"
                href={stelle.quell_url}
                target="_blank"
                rel="noopener noreferrer"
                color="wald"
                size="md"
                rightSection={<IconArrowUpRight size={18} />}
                fullWidth
                style={{ fontWeight: 700 }}
              >
                Zur Stelle &amp; Bewerbung
              </Button>
            </Stack>
          </Card>
        </Box>
      </Flex>
    </Container>
  );
}
