import { ActionIcon, Tooltip } from '@mantine/core';

/** Custom Leaf-Shaped Information Icon. */
export function CustomInfoIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" style={{ display: 'block' }}>
      {/* Leaf outline path */}
      <path
        d="M12 2C7 6 6 12 12 21C18 12 17 6 12 2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Custom lowercase "i" components */}
      <circle cx="12" cy="7.5" r="1.5" fill="currentColor" />
      <path
        d="M12 11v5.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
        variant="light"
        color="wald"
        size="sm"
        radius="xl"
        aria-label="Mehr Informationen"
        style={{
          backgroundColor: 'rgba(21, 107, 65, 0.05)',
          border: '1px solid var(--mantine-color-wald-2)',
          color: 'var(--mantine-color-wald-7)',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.12) rotate(10deg)';
          e.currentTarget.style.backgroundColor = 'var(--mantine-color-wald-1)';
          e.currentTarget.style.color = 'var(--mantine-color-wald-9)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'none';
          e.currentTarget.style.backgroundColor = 'rgba(21, 107, 65, 0.05)';
          e.currentTarget.style.color = 'var(--mantine-color-wald-7)';
        }}
      >
        <CustomInfoIcon />
      </ActionIcon>
    </Tooltip>
  );
}
