export const BRANDING = {
  name: 'WALLVY',
  tagline: 'Make Your Screen Yours.',
  description: 'The ultimate personalization suite for 4K Wallpapers, AI Studio, Edge Lighting, AOD Clocks, and Custom Ringtones.',
  logoUrl: '/logo.png',
  iconSvg: '/icon.svg',
  version: '2.5.0',
  author: 'WALLVY Studios',
  supportEmail: 'support@wallvy.app',
  colors: {
    primary: '#00F0FF',
    primaryGlow: 'rgba(0, 240, 255, 0.4)',
    secondary: '#9B00FF',
    secondaryGlow: 'rgba(155, 0, 255, 0.4)',
    accent: '#FF007A',
    accentGlow: 'rgba(255, 0, 122, 0.4)',
    background: '#060714',
    card: '#0c0e22',
  },
  links: {
    privacy: '/privacy',
    terms: '/terms',
    github: 'https://github.com/wallvy-app',
  }
} as const;

export type BrandingConfig = typeof BRANDING;
