import Link from 'next/link'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import type { BrandSettingsRecord } from '@/lib/types'

type Props = {
  brand: BrandSettingsRecord
  isAuthenticated: boolean
}

export function Navbar({ brand, isAuthenticated }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={brand.logo_url} alt={brand.name} className="h-9 w-9 rounded-full object-contain" />
          <span className="font-heading text-lg font-semibold">{brand.name}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-700 dark:text-slate-200 md:flex">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/book">Book</Link>
          {isAuthenticated ? <Link href="/admin">Dashboard</Link> : <Link href="/login">Login</Link>}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
