import { BookForm } from '@/components/booking/BookForm'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getAvailableDates, getBrandSettings, getPublicServices } from '@/lib/content'

type Props = {
  searchParams: Promise<{
    service?: string
  }>
}

export default async function BookPage({ searchParams }: Props) {
  const [{ service }, brand, services, availableDates] = await Promise.all([
    searchParams,
    getBrandSettings(),
    getPublicServices(),
    getAvailableDates(),
  ])

  return (
    <section className="section">
      <div className="container">
        <SectionHeader
          eyebrow="Book"
          title="Book your appointment"
          description="Choose your treatment, select a free time slot, and confirm your details."
        />
        <BookForm
          availableDates={availableDates}
          brand={brand}
          preselectedServiceId={service}
          services={services}
        />
      </div>
    </section>
  )
}

