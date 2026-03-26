import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getCurrentAdminUser } from '@/lib/auth'
import { getBrandSettings } from '@/lib/content'

import './styles.css'

import { Analytics } from "@vercel/analytics/next"


export const dynamic = 'force-dynamic'

const getGoogleFontsHref = (headingFont: string, bodyFont: string) => {
  const googleFonts = [headingFont, bodyFont]
    .filter(Boolean)
    .map((font) => `${font.replaceAll(' ', '+')}:wght@400;500;600;700`)
    .join('&family=')

  return googleFonts ? `https://fonts.googleapis.com/css2?family=${googleFonts}&display=swap` : null
}

const themeBootstrapScript = `
  (() => {
    const stored = window.localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = stored ? stored === 'dark' : prefersDark;
    document.documentElement.classList.toggle('dark', shouldUseDark);
  })();
`

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandSettings()

  return {
    title: brand.name,
    description: brand.description,
  }
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const [brand, currentAdmin] = await Promise.all([getBrandSettings(), getCurrentAdminUser()])
  const googleFontsHref = getGoogleFontsHref(brand.fonts.heading, brand.fonts.body)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {googleFontsHref ? (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link href={googleFontsHref} rel="stylesheet" />
          </>
        ) : null}
        <style>{`
          :root {
            --color-primary: ${brand.colors.primary};
            --color-secondary: ${brand.colors.secondary};
            --color-accent: ${brand.colors.accent};
            --font-heading: '${brand.fonts.heading}', serif;
            --font-body: '${brand.fonts.body}', sans-serif;
          }
        `}</style>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
      </head>
      <body className="bg-slate-50 font-body text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100">
        <div className="min-h-screen">
          <Navbar brand={brand} isAuthenticated={Boolean(currentAdmin)} />
          <main>{children}</main>
          <Footer brand={brand} />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
