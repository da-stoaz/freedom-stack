import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getBrandSettings, getPublicServices } from '@/lib/content'
import { formatCurrency } from '@/lib/utils'

export default async function ServicesPage() {
  const [brand, services] = await Promise.all([getBrandSettings(), getPublicServices()])

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Services"
          title="Specialist treatment plans for every stage of recovery"
          description={brand.description}
        />

        <div className="card-grid card-grid--two">
          {services.map((service) => (
            <Card key={service.id}>
              <div className="service-card__header">
                <div>
                  <h3>{service.name}</h3>
                  <p className="muted">{service.description}</p>
                </div>
                <Badge>{service.duration_minutes} min</Badge>
              </div>

              <div className="card-meta">
                <p>
                  <strong>{formatCurrency(service.price)}</strong>
                </p>
                <Link href={`/book?service=${service.id}`} className="button-link button-link--accent">
                  Book service
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

