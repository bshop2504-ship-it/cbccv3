// Brand tokens for inline-styled components (mirrors tailwind.config.js).

export const colors = {
  navy: "#093C5D",
  steel: "#3B7597",
  aqua: "#6FD1D7",
  light: "#F5F5F5",
  white: "#FFFFFF",
  danger: "#E53E3E",
  warning: "#F0A500",
};

// Navy at a given opacity — the base for text, borders and tints.
export const ink = (alpha) => `rgba(9,60,93,${alpha})`;

export const fonts = {
  display: "'Playfair Display', Georgia, serif",
  sans: "'DM Sans', system-ui, sans-serif",
  mono: "'DM Mono', monospace",
};

// Accent per uploaded file type (image / video / anything else).
export const fileTypeColor = {
  image: colors.aqua,
  video: colors.steel,
  file: colors.navy,
};
