import type { Metadata } from 'next'
import React from 'react'

import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { getBrandSettings } from '@/lib/content'

import './styles.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandSettings()

  return {
    title: brand.name,
    description: brand.description,
  }
}

export default async function FrontendLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const brand = await getBrandSettings()

  return (
    <html lang="en">
      <body>
        <style>{`
          :root {
            --brand-primary: ${brand.colors.primary};
            --brand-secondary: ${brand.colors.secondary};
            --brand-accent: ${brand.colors.accent};
          }
        `}</style>
        <div className="site-shell">
          <Navbar brand={brand} />
          <main>{children}</main>
          <Footer brand={brand} />
        </div>
      </body>
    </html>
  )
}
