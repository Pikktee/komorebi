import { createTheme, type MantineColorsTuple } from '@mantine/core';

// Tiefes Waldgrün – Primärfarbe
const wald: MantineColorsTuple = [
  '#eef7f1',
  '#d8ece0',
  '#b6d8c4',
  '#8cc4a4',
  '#69b389',
  '#52a877',
  '#43a26d',
  '#338c5b',
  '#287c50',
  '#156b41',
];

// Warmes Terrakotta – Akzent
const terra: MantineColorsTuple = [
  '#fdf1ea',
  '#f6e1d4',
  '#eec0a6',
  '#e69d74',
  '#df7f4a',
  '#db6d30',
  '#da6422',
  '#c25316',
  '#ad4912',
  '#963c09',
];

// Weicher Himmel – „Reise“-Akzent (sanfte Flächen)
const himmel: MantineColorsTuple = [
  '#eef6f6',
  '#dcecec',
  '#bcd9da',
  '#97c4c6',
  '#77b2b5',
  '#62a7aa',
  '#54a1a4',
  '#418b8e',
  '#327c7f',
  '#1d6c6f',
];

// Warmes Sonnenlicht – „Komorebi“-Akzent (Lichtflecken, Glanz)
const sonne: MantineColorsTuple = [
  '#fff8e8',
  '#ffeecb',
  '#fbdd9b',
  '#f7cb6a',
  '#f3bb43',
  '#f1b12b',
  '#f0ab1d',
  '#d59310',
  '#bd8108',
  '#a36e02',
];

export const theme = createTheme({
  primaryColor: 'wald',
  primaryShade: { light: 7, dark: 5 },
  colors: { wald, terra, himmel, sonne },
  white: '#ffffff',
  black: '#16241d',
  defaultRadius: 'lg',
  fontFamily:
    "'Hanken Grotesk', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
  fontFamilyMonospace: "'Hanken Grotesk', ui-monospace, monospace",
  headings: {
    fontFamily: "'Fraunces', Georgia, 'Times New Roman', serif",
    fontWeight: '600',
  },
  defaultGradient: { from: 'wald.8', to: 'wald.6', deg: 135 },
  cursorType: 'pointer',
});
