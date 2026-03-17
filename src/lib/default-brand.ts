export type BrandSettingsShape = {
  name: string
  tagline: string
  description: string
  email: string
  phone: string
  address: string
  socials: {
    instagram?: string
    facebook?: string
  }
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  fonts: {
    heading: string
    body: string
  }
  logo_url: string
}

export const defaultBrandSettings: BrandSettingsShape = {
  name: 'PrimaCura Physio',
  tagline: 'Move Better. Live Better.',
  description: 'Expert physiotherapy in the heart of Vienna.',
  email: 'hello@primacura.at',
  phone: '+43 1 234 5678',
  address: 'Mariahilfer Strasse 12, 1060 Wien',
  socials: {
    instagram: 'https://instagram.com/primacura',
    facebook: 'https://facebook.com/primacura',
  },
  colors: {
    primary: '#2A6B5E',
    secondary: '#E8F4F1',
    accent: '#F0A500',
  },
  fonts: {
    heading: 'Playfair Display',
    body: 'DM Sans',
  },
  logo_url: '/images/logo.svg',
}

