import Link from 'next/link'

import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { getButtonClassName } from '@/components/ui/Button'
import { getBrandSettings, getPublicServices, getVisibleTestimonials } from '@/lib/content'
import { formatCurrency } from '@/lib/utils'

export default async function HomePage() {
  const [brand, services, testimonials] = await Promise.all([
    getBrandSettings(),
    getPublicServices(3),
    getVisibleTestimonials(),
  ])

  const steps = [
    {
      label: 'Choose a service',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 6h16M4 12h16M4 18h10" />
        </svg>
      ),
    },
    {
      label: 'Pick a time',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M8 3v4M16 3v4M4 10h16" />
        </svg>
      ),
    },
    {
      label: 'Get confirmed',
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M20 7 9 18l-5-5" />
        </svg>
      ),
    },
  ]

  return (
    <>
      <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-brand-secondary to-white dark:from-slate-900 dark:to-slate-950">
        <div className="pointer-events-none absolute -right-28 top-12 h-72 w-72 rounded-full bg-brand-primary opacity-20 blur-3xl dark:opacity-30" />
        <div className="pointer-events-none absolute -left-24 bottom-6 h-72 w-72 rounded-full bg-brand-accent opacity-20 blur-3xl dark:opacity-20" />
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <p className="animate-fade-up text-sm uppercase tracking-[0.2em] text-brand-primary dark:text-brand-secondary">
            Physiotherapy Clinic
          </p>
          <h1 className="mt-6 animate-fade-up text-5xl font-semibold leading-tight text-slate-900 [animation-delay:120ms] dark:text-white md:text-7xl">
            {brand.name}
          </h1>
          <p className="mt-5 max-w-2xl animate-fade-up text-xl text-slate-700 [animation-delay:220ms] dark:text-slate-200">
            {brand.tagline}
          </p>
          <p className="mt-4 max-w-2xl animate-fade-up text-base text-slate-600 [animation-delay:320ms] dark:text-slate-300">
            {brand.description}
          </p>
          <div className="mt-10 animate-fade-up [animation-delay:420ms]">
            <Link href="/book" className={getButtonClassName({ variant: 'accent' })}>
              Book an Appointment
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div>
          <SectionHeader
            eyebrow="Services"
            title="Treatments tailored to your goals"
            description="Evidence-based therapy plans designed around your movement, recovery timeline, and lifestyle."
          />

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <Card key={service.id}>
                <h3 className="text-xl font-semibold">{service.name}</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{service.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span>{service.duration_minutes} min</span>
                  <span className="font-medium">{formatCurrency(service.price)}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8">
            <Link href="/services" className={getButtonClassName({ variant: 'secondary' })}>
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900/40">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeader eyebrow="How It Works" title="Simple and stress-free booking" centered />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <Card key={step.label} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary text-brand-primary">
                  {step.icon}
                </div>
                <p className="mt-4 text-lg font-medium">{step.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div>
          <SectionHeader
            eyebrow="Testimonials"
            title="What patients say"
            description="Trusted by active professionals, athletes, and people recovering from pain."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.id}>
                <div className="text-brand-accent">{'*'.repeat(item.rating)}</div>
                <p className="mt-4 text-sm text-slate-700 dark:text-slate-200">{item.body}</p>
                <p className="mt-4 text-sm font-medium">{item.author_name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 dark:bg-slate-900/40">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 md:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow="About"
              title="High-touch physiotherapy in central Vienna"
              description="We combine hands-on treatment and measurable progress plans to help you move confidently and stay active."
            />
          </div>
          <Card className="bg-brand-secondary dark:bg-slate-900">
            <p className="text-sm text-slate-700 dark:text-slate-200">{brand.address}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{brand.phone}</p>
            <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{brand.email}</p>
            <div className="mt-6 h-40 rounded-2xl border border-dashed border-slate-300 bg-white/60 dark:border-slate-700 dark:bg-slate-800/60" />
          </Card>
        </div>
      </section>

      <section className="bg-brand-accent py-16">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center">
          <h2 className="text-3xl font-semibold text-slate-900 md:text-4xl">Ready to feel better this week?</h2>
          <Link href="/book" className={getButtonClassName({ variant: 'primary' })}>
            Book now
          </Link>
        </div>
      </section>
    </>
  )
}
