import Link from 'next/link'

import { Badge } from '@/components/ui/Badge'
import { getButtonClassName } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getBrandSettings, getPublicServices } from '@/lib/content'
import { formatCurrency } from '@/lib/utils'

export default async function ServicesPage() {
  const [brand, services] = await Promise.all([getBrandSettings(), getPublicServices()])

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div>
        <SectionHeader
          eyebrow="Services"
          title="Specialist treatment plans for every stage of recovery"
          description={brand.description}
        />

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-semibold">{service.name}</h3>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
                </div>
                <Badge>{service.duration_minutes} min</Badge>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-lg font-medium">{formatCurrency(service.price)}</p>
                <Link href={`/book?service=${service.id}`} className={getButtonClassName({ variant: 'accent' })}>
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
