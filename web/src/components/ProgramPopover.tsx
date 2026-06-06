import { Box, Group, Popover, Table, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconBook2, IconCalendar, IconCircleCheck, IconCoins, IconInfoCircle, IconUser } from '@tabler/icons-react';
import type { Programm } from '../types';
import { PROGRAMM_LABEL } from '../lib/labels';

interface ProgramPopoverProps {
  programm: Programm;
  children?: React.ReactNode;
}

interface ProgramDetails {
  title: string;
  traeger: string;
  alter: string;
  dauer: string;
  kosten: string;
  leistungen: string[];
  beschreibung: string;
}

const DETAILS: Record<Programm, ProgramDetails> = {
  ESC: {
    title: 'Europäisches Solidaritätskorps (ESC)',
    traeger: 'Europäische Union (EU)',
    alter: '18 bis 30 Jahre',
    dauer: '2 bis 12 Monate',
    kosten: '100% kostenfrei für dich',
    leistungen: ['Reisekosten (anteilig)', 'Freie Unterkunft & Verpflegung', 'Kranken- & Unfallversicherung', 'Monatliches Taschengeld', 'Online-Sprachkurs'],
    beschreibung: 'Das Vorzeigeprogramm der EU zur Förderung von Solidarität und sozialem Engagement junger Menschen in Europa und ausgewählten Partnerländern.',
  },
  IJFD: {
    title: 'Internationaler Jugendfreiwilligendienst',
    traeger: 'Bundesministerium für Familie, Senioren, Frauen und Jugend (BMFSFJ)',
    alter: '16 bis 26 Jahre',
    dauer: '6 bis 18 Monate',
    kosten: 'Gebührenfrei (Unterstützerkreis möglich)',
    leistungen: ['Unterkunft & Verpflegung', 'Pädagogische Begleitung & Seminare', 'Monatliches Taschengeld', 'Auslands-Krankenversicherung', 'Kindergeld läuft weiter'],
    beschreibung: 'Ein staatlicher deutscher Freiwilligendienst, der dir interkulturelle und praktische Erfahrungen im Ausland ermöglicht.',
  },
  weltwärts: {
    title: 'weltwärts Freiwilligendienst',
    traeger: 'Bundesministerium für wirtschaftliche Zusammenarbeit und Entwicklung (BMZ)',
    alter: '18 bis 28 Jahre (mit Behinderung bis 35)',
    dauer: '6 bis 24 Monate (meist 12)',
    kosten: 'Gebührenfrei (Aufbau eines Förderkreises erwünscht)',
    leistungen: ['Reisekosten komplett', 'Unterkunft & Verpflegung frei', 'Umfassendes Versicherungspaket', 'Taschengeld', 'Seminare zur Vor- und Nachbereitung'],
    beschreibung: 'Der entwicklungspolitische Freiwilligendienst mit Fokus auf Projekte im Globalen Süden. Freiwillige engagieren sich auf Augenhöhe.',
  },
  kulturweit: {
    title: 'kulturweit Freiwilligendienst',
    traeger: 'Deutsche UNESCO-Kommission / Auswärtiges Amt',
    alter: '18 bis 26 Jahre',
    dauer: '6 oder 12 Monate',
    kosten: '100% kostenfrei für dich',
    leistungen: ['Reisekostenpauschale', 'Unterkunft- & Verpflegungszuschuss', 'Monatliches Taschengeld', 'Auslandskrankenversicherung', 'Seminare & Zertifikat'],
    beschreibung: 'Der internationale Kulturfreiwilligendienst. Er bietet Einsätze im Bildungs-, Kultur- und ökologischen Bereich weltweit.',
  },
  keins: {
    title: 'Individuelle Vermittlung',
    traeger: 'Jeweilige Organisation vor Ort (NGO, Park, etc.)',
    alter: 'Meist ab 18 Jahre (nach oben offen)',
    dauer: 'Flexibel (Tage, Wochen oder Monate)',
    kosten: 'Variabel (teilweise Kosten für Kost/Logis oder Gebühren)',
    leistungen: ['Je nach Organisation sehr unterschiedlich', 'Manche bieten Kost & Unterkunft frei', 'Meist keine Reisekostenübernahme', 'Eigenverantwortliche Versicherung'],
    beschreibung: 'Diese Stellen laufen über kein staatliches Programm. Achte hier besonders im Detailbereich darauf, welche Kosten von der Organisation getragen werden.',
  },
};

export function ProgramPopover({ programm, children }: ProgramPopoverProps) {
  const [opened, { close, open }] = useDisclosure(false);
  const info = DETAILS[programm];

  // Default trigger if no children provided
  const trigger = children ? (
    <div onMouseEnter={open} onMouseLeave={close} onClick={open} style={{ cursor: 'pointer', display: 'inline-flex' }}>
      {children}
    </div>
  ) : (
    <Group gap={4} onMouseEnter={open} onMouseLeave={close} onClick={open} style={{ cursor: 'pointer', color: 'var(--mantine-color-himmel-7)' }}>
      <Text size="xs" fw={600}>{PROGRAMM_LABEL[programm]}</Text>
      <IconInfoCircle size={14} />
    </Group>
  );

  return (
    <Popover
      width={360}
      position="top"
      withArrow
      shadow="md"
      opened={opened}
      radius="md"
      styles={{
        dropdown: {
          border: '1px solid var(--nz-line)',
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          backdropFilter: 'blur(8px)',
          padding: 16,
        },
      }}
    >
      <Popover.Target>
        {trigger}
      </Popover.Target>
      <Popover.Dropdown style={{ pointerEvents: 'none' }}>
        <Box>
          <Text fw={700} fz="sm" className="nz-display" c="wald.9" mb={4}>
            {info.title}
          </Text>
          <Text size="xs" c="dimmed" mb="xs" lh={1.3}>
            {info.beschreibung}
          </Text>

          <Table verticalSpacing={4} horizontalSpacing={0} withRowBorders={false} fz="xs" mb="xs">
            <Table.Tbody>
              <Table.Tr>
                <Table.Td w={90} valign="top">
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconBook2 size={13} />
                    <Text size="xs" fw={600}>Träger</Text>
                  </Group>
                </Table.Td>
                <Table.Td fw={500}>{info.traeger}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td valign="top">
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconUser size={13} />
                    <Text size="xs" fw={600}>Alter</Text>
                  </Group>
                </Table.Td>
                <Table.Td fw={500}>{info.alter}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td valign="top">
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconCalendar size={13} />
                    <Text size="xs" fw={600}>Dauer</Text>
                  </Group>
                </Table.Td>
                <Table.Td fw={500}>{info.dauer}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td valign="top">
                  <Group gap={4} wrap="nowrap" c="dimmed">
                    <IconCoins size={13} />
                    <Text size="xs" fw={600}>Kosten</Text>
                  </Group>
                </Table.Td>
                <Table.Td fw={600} c={programm === 'keins' ? 'terra.8' : 'wald.8'}>
                  {info.kosten}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>

          <Text size="xs" fw={700} c="wald.8" mb={4} mt={6}>
            Übernommene Leistungen:
          </Text>
          <Box style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {info.leistungen.map((l, i) => (
              <Group key={i} gap={4} wrap="nowrap" align="flex-start">
                <IconCircleCheck size={12} style={{ color: 'var(--mantine-color-wald-6)', marginTop: 2, flexShrink: 0 }} />
                <Text size="xs" style={{ lineHeight: 1.2 }}>{l}</Text>
              </Group>
            ))}
          </Box>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
}
