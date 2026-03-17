import Link from 'next/link'

import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getBrandSettings, getPublicServices, getVisibleTestimonials } from '@/lib/content'
import { formatCurrency } from '@/lib/utils'

export default async function HomePage() {
  const [brand, services, testimonials] = await Promise.all([
    getBrandSettings(),
    getPublicServices(3),
    getVisibleTestimonials(),
  ])

  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <p className="hero__eyebrow">Physiotherapy Clinic</p>
          <h1>{brand.name}</h1>
          <p className="hero__tagline">{brand.tagline}</p>
          <p className="hero__description">{brand.description}</p>
          <div className="cta-row">
            <Link href="/book" className="button-link button-link--accent">
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Services"
            title="Treatments tailored to your goals"
            description="Evidence-based therapy plans designed around your movement, recovery timeline, and lifestyle."
          />

          <div className="card-grid card-grid--three">
            {services.map((service) => (
              <Card key={service.id}>
                <h3>{service.name}</h3>
                <p className="muted">{service.description}</p>
                <div className="card-meta">
                  <span>{service.duration_minutes} min</span>
                  <strong>{formatCurrency(service.price)}</strong>
                </div>
              </Card>
            ))}
          </div>

          <div className="cta-row">
            <Link href="/services" className="button-link button-link--secondary">
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container">
          <SectionHeader eyebrow="How It Works" title="Simple and stress-free booking" centered />
          <div className="card-grid card-grid--three">
            {[
              'Choose a service',
              'Pick a time',
              'Get confirmed',
            ].map((step) => (
              <Card key={step}>
                <h3>{step}</h3>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeader
            eyebrow="Testimonials"
            title="What patients say"
            description="Trusted by active professionals, athletes, and people recovering from pain."
          />
          <div className="card-grid card-grid--three">
            {testimonials.map((item) => (
              <Card key={item.id}>
                <div className="rating">{'*'.repeat(item.rating)}</div>
                <p>{item.body}</p>
                <p className="muted">
                  <strong>{item.author_name}</strong>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container split-grid">
          <div>
            <SectionHeader
              eyebrow="About"
              title="High-touch physiotherapy in central Vienna"
              description="We combine hands-on treatment and measurable progress plans to help you move confidently and stay active."
            />
          </div>
          <Card>
            <p>{brand.address}</p>
            <p>{brand.phone}</p>
            <p>{brand.email}</p>
            <div className="map-placeholder" />
          </Card>
        </div>
      </section>

      <section className="section section--accent">
        <div className="container cta-banner">
          <h2>Ready to feel better this week?</h2>
          <Link href="/book" className="button-link button-link--primary">
            Book now
          </Link>
        </div>
      </section>
    </>
  )
}

