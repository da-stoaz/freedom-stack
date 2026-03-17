import Image from 'next/image'
import Link from 'next/link'

import type { BrandSettingsRecord } from '@/lib/types'

type Props = {
  brand: BrandSettingsRecord
}

export function Navbar({ brand }: Props) {
  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link href="/" className="brand-mark">
          <Image src={brand.logo_url} alt={brand.name} className="brand-mark__logo" width={42} height={42} />
          <span className="brand-mark__text">{brand.name}</span>
        </Link>

        <nav className="site-nav">
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/book">Book</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  )
}
