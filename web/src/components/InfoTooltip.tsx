import { ActionIcon, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

/** Kleines Info-Symbol mit veredeltem Tooltip und Hover-Effekten. */
export function InfoTooltip({ label }: { label: string }) {
  return (
    <Tooltip
      label={label}
      multiline
      w={280}
      withArrow
      events={{ hover: true, focus: true, touch: true }}
      transitionProps={{ transition: 'fade', duration: 150 }}
      styles={{
        tooltip: {
          backgroundColor: 'var(--nz-ink)',
          color: '#eaf5ee',
          padding: '10px 14px',
          fontSize: '12px',
          lineHeight: 1.45,
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 10px 25px -5px rgba(10, 42, 27, 0.3)',
        },
      }}
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size={18}
        radius="xl"
        aria-label="Mehr Informationen"
        style={{
          color: 'var(--mantine-color-gray-5)',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.backgroundColor = 'rgba(21, 107, 65, 0.08)';
          e.currentTarget.style.color = 'var(--mantine-color-wald-7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = 'var(--mantine-color-gray-5)';
        }}
      >
        <IconInfoCircle size={14} stroke={2} />
      </ActionIcon>
    </Tooltip>
  );
}
