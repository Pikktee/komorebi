import type { ReactNode } from 'react';
import { Card, Group, Stack, Text, ThemeIcon, Box, Flex } from '@mantine/core';
import { IconPointFilled } from '@tabler/icons-react';

interface TippBoxProps {
  titel: string;
  icon: ReactNode;
  color?: 'wald' | 'terra' | 'himmel' | 'sonne';
  takeaway: ReactNode;
  points?: ReactNode[];
  children?: ReactNode;
  mt?: string | number;
  mb?: string | number;
}

export function TippBox({
  titel,
  icon,
  color = 'wald',
  takeaway,
  points = [],
  children,
  mt,
  mb,
}: TippBoxProps) {
  return (
    <Card
      withBorder
      radius="lg"
      p={{ base: 'md', sm: 'lg' }}
      mt={mt}
      mb={mb}
      style={{
        borderColor: `var(--mantine-color-${color}-3)`,
        backgroundColor: `var(--mantine-color-${color}-0)`,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 8px 24px -12px rgba(20, 35, 27, 0.08)',
      }}
    >
      {/* Subtiler Deko-Glow im Hintergrund */}
      <Box
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: 999,
          background: `radial-gradient(circle, var(--mantine-color-${color}-2) 0%, transparent 70%)`,
          opacity: 0.6,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <Flex
        direction={{ base: 'column', sm: 'row' }}
        gap={{ base: 'sm', sm: 'md' }}
        align="flex-start"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <ThemeIcon
          variant="light"
          color={color}
          radius="md"
          size={38}
          style={{
            flexShrink: 0,
            border: `1px solid var(--mantine-color-${color}-2)`,
          }}
        >
          {icon}
        </ThemeIcon>

        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Stack gap={4}>
            <Text
              fz="xs"
              fw={700}
              tt="uppercase"
              lts={1.2}
              c={`${color}.9`}
            >
              {titel}
            </Text>
            <Text fz="sm" fw={600} style={{ lineHeight: 1.45 }}>
              {takeaway}
            </Text>
          </Stack>

          {points.length > 0 && (
            <Stack gap={6} mt={2}>
              {points.map((point, index) => (
                <Group key={index} gap="xs" align="flex-start" wrap="nowrap">
                  <ThemeIcon
                    variant="transparent"
                    color={color}
                    size={14}
                    style={{ flexShrink: 0, marginTop: 3 }}
                  >
                    <IconPointFilled size={8} />
                  </ThemeIcon>
                  <Text fz="xs" c="dark.5" style={{ lineHeight: 1.4 }}>
                    {point}
                  </Text>
                </Group>
              ))}
            </Stack>
          )}

          {children && (
            <Box mt={2} fz="xs" c="dark.5" style={{ lineHeight: 1.4 }}>
              {children}
            </Box>
          )}
        </Stack>
      </Flex>
    </Card>
  );
}
