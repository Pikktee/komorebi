import { Box, Burger, Container, Divider, Drawer, Group, Stack, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Link, NavLink, Outlet } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { Logo } from './Logo';

const NAV = [
  { to: '/', label: 'Start', end: true },
  { to: '/finden', label: 'Stellen finden', end: false },
  { to: '/karte', label: 'Karte', end: false },
  { to: '/wissen', label: 'Wissen', end: false },
  { to: '/plattformen', label: 'Plattformen', end: false },
  { to: '/ueber', label: 'Über', end: false },
];

function navStyle({ isActive }: { isActive: boolean }): CSSProperties {
  return {
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: 15,
    color: isActive ? 'var(--mantine-color-wald-8)' : 'var(--nz-ink)',
    paddingBottom: 4,
    borderBottom: isActive ? '2px solid var(--mantine-color-wald-6)' : '2px solid transparent',
  };
}

export function Layout() {
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <Box style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      <Box
        component="header"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(247, 244, 236, 0.82)',
          borderBottom: '1px solid var(--nz-line)',
        }}
      >
        <Container size="lg" py="sm">
          <Group justify="space-between">
            <Link to="/" aria-label="Komorebi Startseite" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Logo />
            </Link>
            <Group gap="xl" visibleFrom="sm">
              {NAV.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} style={navStyle}>
                  {n.label}
                </NavLink>
              ))}
            </Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" aria-label="Menü öffnen" />
          </Group>
        </Container>
      </Box>

      <Drawer opened={opened} onClose={close} title={<Logo size={28} />} padding="lg" size="xs" position="right" closeButtonProps={{ 'aria-label': 'Menü schließen' }}>
        <Stack gap="lg" mt="md">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} style={navStyle} onClick={close}>
              {n.label}
            </NavLink>
          ))}
        </Stack>
      </Drawer>

      <Box component="main" style={{ flex: 1 }}>
        <Outlet />
      </Box>

      <Box component="footer" mt={64} style={{ borderTop: '1px solid var(--nz-line)' }}>
        <Container size="lg" py="xl">
          <Group justify="space-between" align="flex-start">
            <Stack gap={4}>
              <Logo size={26} />
              <Text size="sm" c="dimmed" maw={420}>
                Komorebi – das Licht, das durch die Blätter fällt. Ökologische Freiwilligendienste
                weltweit: Naturschutz, Artenschutz und Feldforschung, an einem Ort durchsuchbar.
              </Text>
            </Stack>
            <Stack gap={2}>
              <Text size="sm" c="dimmed">
                Nicht-kommerzielles Projekt
              </Text>
              <Text size="xs" c="dimmed">
                Daten täglich automatisch aktualisiert
              </Text>
            </Stack>
          </Group>
          <Divider my="lg" />
          <Text size="xs" c="dimmed">
            Angaben ohne Gewähr. Verbindliche Infos findest du immer bei der jeweiligen Organisation.
          </Text>
        </Container>
      </Box>
    </Box>
  );
}
