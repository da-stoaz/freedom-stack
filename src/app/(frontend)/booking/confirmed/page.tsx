import Link from 'next/link'

import { getButtonClassName } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { formatCurrency, formatShortDate } from '@/lib/utils'

type Props = {
  searchParams: Promise<{
    service?: string
    date?: string
    time?: string
    price?: string
  }>
}

export default async function BookingConfirmedPage({ searchParams }: Props) {
  const summary = await searchParams

  return (
    <section className="mx-auto max-w-2xl px-6 py-24">
      <div>
        <Card className="text-center">
          <div className="mx-auto flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-brand-secondary text-brand-primary dark:bg-slate-800">
            <svg
              viewBox="0 0 24 24"
              className="h-10 w-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold">Your booking request is in</h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            A confirmation email has been sent with your appointment details.
          </p>

          {summary.service ? (
            <div className="mt-6 rounded-2xl border border-slate-200 p-4 text-left text-sm dark:border-slate-700">
              <p>
                <strong>Service:</strong> {summary.service}
              </p>
              <p>
                <strong>Date:</strong> {summary.date ? formatShortDate(summary.date) : '-'}
              </p>
              <p>
                <strong>Time:</strong> {summary.time || '-'}
              </p>
              <p>
                <strong>Price:</strong> {summary.price ? formatCurrency(summary.price) : '-'}
              </p>
            </div>
          ) : null}

          <div className="mt-8">
            <Link href="/" className={getButtonClassName({ variant: 'primary' })}>
              Return home
            </Link>
          </div>
        </Card>
      </div>
    </section>
  )
}
