import { Badge, Group, Tooltip } from '@mantine/core';
import {
  IconHome,
  IconCoin,
  IconPlane,
  IconShieldCheck,
  IconLanguage,
  IconAlertTriangle,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import type { Stelle } from '../types';

interface BadgeInfo {
  icon: ReactNode;
  text: string;
  color: string;
  tip: string;
}

export function leistungsListe(stelle: Stelle): BadgeInfo[] {
  const items: BadgeInfo[] = [];
  if (stelle.kostenpflichtig) {
    items.push({
      icon: <IconAlertTriangle size={13} />,
      text:
        stelle.teilnahmegebuehr_eur != null
          ? `Gebühr ${stelle.teilnahmegebuehr_eur.toLocaleString('de-DE')} €`
          : 'Kostenpflichtig',
      color: 'terra',
      tip: 'Für dieses Programm zahlst du eine Teilnahmegebühr (Voluntourism). Prüfe genau, was darin enthalten ist.',
    });
  }
  if (stelle.kost_unterkunft_frei) {
    items.push({
      icon: <IconHome size={13} />,
      text: 'Kost & Unterkunft frei',
      color: 'wald',
      tip: 'Unterkunft und Verpflegung werden für dich gestellt.',
    });
  }
  if (stelle.taschengeld_eur_monat) {
    items.push({
      icon: <IconCoin size={13} />,
      text: `${stelle.taschengeld_eur_monat} €/Monat`,
      color: 'wald',
      tip: 'Monatliches Taschengeld für deine persönlichen Ausgaben.',
    });
  }
  if (stelle.reisekosten_erstattet) {
    items.push({
      icon: <IconPlane size={13} />,
      text: 'Reise erstattet',
      color: 'wald',
      tip: 'Deine An- und Abreise wird (anteilig) erstattet.',
    });
  }
  if (stelle.versicherung) {
    items.push({
      icon: <IconShieldCheck size={13} />,
      text: 'Versichert',
      color: 'wald',
      tip: 'Eine Versicherung für den Einsatz ist inklusive.',
    });
  }
  if (stelle.sprachkurs) {
    items.push({
      icon: <IconLanguage size={13} />,
      text: 'Sprachkurs',
      color: 'wald',
      tip: 'Ein Sprachkurs ist Teil des Angebots.',
    });
  }
  return items;
}

export function LeistungsBadges({ stelle }: { stelle: Stelle }) {
  const items = leistungsListe(stelle);
  return (
    <Group gap={6}>
      {items.map((b) => (
        <Tooltip key={b.text} label={b.tip} multiline w={240} withArrow events={{ hover: true, focus: true, touch: true }}>
          <Badge
            variant={b.color === 'terra' ? 'filled' : 'light'}
            color={b.color}
            leftSection={b.icon}
            radius="sm"
            style={{ textTransform: 'none', fontWeight: 600 }}
          >
            {b.text}
          </Badge>
        </Tooltip>
      ))}
    </Group>
  );
}
