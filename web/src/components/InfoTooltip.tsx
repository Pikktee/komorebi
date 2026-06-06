import { ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

/** Kleines Info-Symbol mit Tooltip (Hover, Fokus und Touch). */
export function InfoTooltip({ label }: { label: string }) {
  return (
    <Tooltip
      label={label}
      multiline
      w={280}
      withArrow
      events={{ hover: true, focus: true, touch: true }}
    >
      <ActionIcon
        variant="subtle"
        color="wald"
        size="sm"
        radius="xl"
        aria-label="Mehr Informationen"
      >
        <IconInfoCircle size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
