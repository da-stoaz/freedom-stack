import Link from 'next/link'

import type { BrandSettingsRecord } from '@/lib/types'

type Props = {
  brand: BrandSettingsRecord
}

export function Footer({ brand }: Props) {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 rounded-full object-contain" />
            <span className="font-heading text-lg font-semibold">{brand.name}</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">{brand.description}</p>
        </div>

        <div>
          <h3 className="mb-3 font-medium">Navigation</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              <Link href="/">Home</Link>
            </p>
            <p>
              <Link href="/services">Services</Link>
            </p>
            <p>
              <Link href="/book">Book</Link>
            </p>
            <p>
              <Link href="/admin">Admin</Link>
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">Contact</h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>{brand.address}</p>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={`tel:${brand.phone}`}>{brand.phone}</a>
            <div className="flex gap-3">
              {brand.socials.instagram ? <a href={brand.socials.instagram}>Instagram</a> : null}
              {brand.socials.facebook ? <a href={brand.socials.facebook}>Facebook</a> : null}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
