import Image from 'next/image'
import Link from 'next/link'

import type { BrandSettingsRecord } from '@/lib/types'

type Props = {
  brand: BrandSettingsRecord
}

export function Footer({ brand }: Props) {
  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="brand-mark">
            <Image src={brand.logo_url} alt={brand.name} className="brand-mark__logo" width={42} height={42} />
            <span className="brand-mark__text">{brand.name}</span>
          </div>
          <p className="muted">{brand.description}</p>
        </div>

        <div>
          <h3>Navigation</h3>
          <div className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/book">Book</Link>
            <Link href="/admin">Admin</Link>
          </div>
        </div>

        <div>
          <h3>Contact</h3>
          <div className="footer-links">
            <p>{brand.address}</p>
            <a href={`mailto:${brand.email}`}>{brand.email}</a>
            <a href={`tel:${brand.phone}`}>{brand.phone}</a>
            {brand.socials.instagram ? <a href={brand.socials.instagram}>Instagram</a> : null}
            {brand.socials.facebook ? <a href={brand.socials.facebook}>Facebook</a> : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
