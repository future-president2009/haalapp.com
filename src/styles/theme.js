// src/styles/theme.js
console.log("Loading theme file...");
// src/styles/theme.js
// src/styles/theme.js

export const colors = {
  // Backgrounds (blue-tinted)
  background: '#EEF4FF',        // soft sky blue
  surface: '#FFFFFF',
  surfaceLight: '#F6F8FF',      // very light blue for sections/cards

  // Brand (softer lavender/periwinkle)
  primary: '#8FA8FF',           // calm periwinkle (replaces dark purple)
  primaryDark: '#6F86F5',       // for pressed states
  primarySoft: '#DDE6FF',       // for pill backgrounds / subtle fills

  // Optional secondary (soft pink accent)
  secondary: '#F5B8D2',
  secondarySoft: '#FDE7F1',

  // Text (softer, not harsh)
  textPrimary: '#243047',       // soft navy/charcoal
  textSecondary: '#4E5A73',
  textMuted: '#7E8AA6',

  // Feedback (muted)
  success: '#7FCFA0',
  warning: '#F2C06B',
  error: '#F2A3A3',

  // Accent (minty blue)
  accent: '#6ED7D0',
};


export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};
export const typography = {
  h1: { fontSize: 30, fontWeight: '600', color: '#243047' },
  h2: { fontSize: 22, fontWeight: '500', color: '#243047' },
  h3: { fontSize: 18, fontWeight: '500', color: '#243047' },

  body: { fontSize: 16, color: '#243047', lineHeight: 22 },
  bodySecondary: { fontSize: 16, color: '#4E5A73', lineHeight: 22 },
  caption: { fontSize: 14, color: '#7E8AA6' },

  // New: for subtitles on colored cards
  subtitleOnPrimary: { fontSize: 14, color: 'rgba(255,255,255,0.82)' },
  subtitleMuted: { fontSize: 14, color: '#6B7896' },

  button: { fontSize: 16, fontWeight: '500', color: '#243047' }
};



export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

console.log("borderRadius exported:", borderRadius);
console.log("All exports:", { colors, spacing, typography, borderRadius });