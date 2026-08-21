export const designTokens = {
  colors: {
    background: 'var(--color-background)',
    foreground: 'var(--color-foreground)',
    surface: 'var(--color-surface)',
    surfaceElevated: 'var(--color-surface-elevated)',
    primary: 'var(--color-primary)',
    primaryForeground: 'var(--color-primary-foreground)',
    primaryMuted: 'var(--color-primary-muted)',
    gold: 'var(--color-gold)',
    goldMuted: 'var(--color-gold-muted)',
    sand: 'var(--color-sand)',
    terracotta: 'var(--color-terracotta)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
  typography: {
    display: 'var(--font-display)',
    heading: 'var(--font-heading)',
    body: 'var(--font-sans)',
  },
  motion: {
    micro: '150ms ease-in-out',
    standard: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    cinematic: '900ms cubic-bezier(0.22, 1, 0.36, 1)',
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  materials: {
    felt: "bg-surface opacity-95 bg-[url('/textures/felt.png')] mix-blend-multiply",
    sand: "bg-sand opacity-95 bg-[url('/textures/sand.png')] mix-blend-multiply",
    nightSky: 'bg-background bg-gradient-to-b from-transparent to-black/40',
  }
}

export type DesignTokenColor = keyof typeof designTokens.colors
export type DesignTokenTypography = keyof typeof designTokens.typography
export type DesignTokenMotion = keyof typeof designTokens.motion
export type DesignTokenMaterial = keyof typeof designTokens.materials
