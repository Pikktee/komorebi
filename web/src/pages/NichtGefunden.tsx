import { Link } from 'react-router-dom';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { KomorebiMark } from '../components/Logo';

export function NichtGefunden() {
  return (
    <Container size="sm" py={96}>
      <Stack align="center" gap="md">
        <KomorebiMark size={64} />
        <Text className="nz-display" fz={64} fw={600} c="wald.7" lh={1}>
          404
        </Text>
        <Title order={2} ta="center">
          Diese Seite ist im Dickicht verschwunden
        </Title>
        <Text c="dimmed" ta="center" maw={420}>
          Vielleicht hat sich ein Link verlaufen. Geh zurück zum Start oder such dir direkt eine Stelle.
        </Text>
        <Button component={Link} to="/" color="wald">
          Zur Startseite
        </Button>
      </Stack>
    </Container>
  );
}
